import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { returnRelationsObject } from 'src/helpers/relationArrayToObject';
import { Losenord } from 'src/losenord/entities/losenord.entity';
import { LosenordService } from 'src/losenord/losenord.service';
import {
  DbQueryService,
  QueryDetails,
} from 'src/services/db-query/db-query.service';
import { S3Service } from 'src/services/s3/s3.service';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private losenordService: LosenordService,
    private s3Service: S3Service,
    private dbQueryService: DbQueryService,
  ) {}
  logger = new Logger(UserService.name);
  create(createUserDto: CreateUserDto) {
    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;

    const newLosenord = new Losenord();
    newLosenord.losenord = createUserDto.losenord;

    newUser.losenord = [newLosenord];

    return this.userRepository.save(newUser);
  }

  findCurrent(relations: string[] = []) {
    return this.userRepository.find({
      relations: returnRelationsObject(relations),
    });
  }

  async findAll(queryFormatted: QueryDetails, relations: string[] = []) {
    const query = this.dbQueryService.queryBuilder(queryFormatted);
    const rawUserList = await this.userRepository.findAndCount({
      ...query,
      relations: returnRelationsObject(relations),
      // select: ['id', 'firstName', 'lastName', 'profilePhoto'],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePhoto: true,
        groups: {
          id: true,
        },
        adminForGroups: {
          id: true,
        },
      },
    });
    if (rawUserList && rawUserList[1] > 0) {
      const formattedUser = await Promise.all(
        rawUserList[0].map(async (user) => {
          if (user) {
            let imageGetUrl = '';
            if (user.profilePhoto) {
              imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
                user.profilePhoto,
              );
            }
            return { ...user, imageGetUrl };
          }
        }),
      );
      return {
        users: formattedUser,
        count: rawUserList[1],
      };
    }
    return {
      users: rawUserList[0],
      count: rawUserList[1],
    };
  }

  findSeveralUsers(ids: string[]) {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        activities: true,
      },
    });
    if (user) {
      let imageGetUrl = '';
      if (user.profilePhoto) {
        imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
          user.profilePhoto,
        );
      }
      if (user.activities && user.activities.length > 0) {
        const repackageUserActivities = [];
        await Promise.all(
          user.activities.map(async (activity) => {
            let getImageUrl = '';
            if (activity.coverPhoto) {
              getImageUrl = await this.s3Service.getImageObjectSignedUrl(
                activity.coverPhoto,
              );
            }
            repackageUserActivities.push({
              ...activity,
              getImageUrl,
            });
          }),
        );
        user.activities = repackageUserActivities;
      }
      return { ...user, imageGetUrl };
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  findOneNoImage(id: string) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.save({
      id: id,
      ...updateUserDto,
    });
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      let imageGetUrl = '';
      if (user.profilePhoto) {
        imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
          user.profilePhoto,
        );
      }
      return { ...user, imageGetUrl };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findOneByEmail(email: string, relations: string[] = []) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: returnRelationsObject(relations),
    });
  }

  async findByEmailWithImage(email: string, relations: string[] = []) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: returnRelationsObject(relations),
    });
    if (user) {
      let imageGetUrl = '';
      if (user.profilePhoto) {
        imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
          user.profilePhoto,
        );
      }
      return { ...user, imageGetUrl };
    }
  }

  async userLogIn(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        losenord: true,
      },
      order: {
        losenord: {
          createdAt: 'DESC',
        },
      },
    });
    return user;
  }

  dbTest(): Promise<User[]> {
    return this.userRepository.find({
      select: {
        createdAt: true,
      },
      take: 1,
    });
  }
}

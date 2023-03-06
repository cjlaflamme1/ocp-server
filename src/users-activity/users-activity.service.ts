import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityTypesService } from 'src/activity-types/activity-types.service';
import { S3Service } from 'src/services/s3/s3.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateUsersActivityDto } from './dto/create-users-activity.dto';
import { UpdateUsersActivityDto } from './dto/update-users-activity.dto';
import { UsersActivity } from './entities/users-activity.entity';

@Injectable()
export class UsersActivityService {
  constructor(
    @InjectRepository(UsersActivity)
    private usersActivityRepository: Repository<UsersActivity>,
    private s3Service: S3Service,
    private activityTypesService: ActivityTypesService,
    private userService: UserService,
  ) {}
  logger = new Logger(UsersActivityService.name);
  async create(
    createUsersActivityDto: CreateUsersActivityDto,
    userEmail: string,
  ) {
    const user = await this.userService.findOneByEmail(userEmail);
    return this.usersActivityRepository.save({
      ...createUsersActivityDto,
      activityType: await this.activityTypesService.findOne(
        createUsersActivityDto.activityTypeId,
      ),
      user,
    });
  }

  async findAllForUser(email: string) {
    const activities = await this.usersActivityRepository.find({
      where: {
        user: {
          email,
        },
      },
    });
    if (activities && activities.length > 0) {
      const returnedActivities = [];
      await Promise.all(
        activities.map(async (activity) => {
          let getImageUrl = '';
          if (activity.coverPhoto) {
            getImageUrl = await this.s3Service.getImageObjectSignedUrl(
              activity.coverPhoto,
            );
          }
          returnedActivities.push({
            ...activity,
            getImageUrl,
          });
        }),
      );
      return returnedActivities;
    }
  }

  // findAll() {
  //   return `This action returns all usersActivity`;
  // }

  async findOne(id: string) {
    const activity = await this.usersActivityRepository.findOne({
      where: {
        id: id,
      },
    });
    if (activity) {
      let getImageUrl = '';
      if (activity.coverPhoto) {
        getImageUrl = await this.s3Service.getImageObjectSignedUrl(
          activity.coverPhoto,
        );
      }
      return {
        ...activity,
        getImageUrl,
      };
    }
    return activity;
  }

  async update(id: string, updateUsersActivityDto: UpdateUsersActivityDto) {
    const activityToUpdate = await this.usersActivityRepository.save({
      id,
      ...updateUsersActivityDto,
    });
    if (activityToUpdate) {
      return this.findOne(id);
    }
    throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const activity = await this.usersActivityRepository.find({
      where: {
        id,
      },
    });
    if (activity) {
      return this.usersActivityRepository.softRemove(activity);
    }
    throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
  }
}

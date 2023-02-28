import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { returnRelationsObject } from 'src/helpers/relationArrayToObject';
import { Losenord } from 'src/losenord/entities/losenord.entity';
import { LosenordService } from 'src/losenord/losenord.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private losenordService: LosenordService,
  ) {}
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

  findAll(relations: string[] = []) {
    return this.userRepository.find({
      relations: returnRelationsObject(relations),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findOneByEmail(email: string, relations: string[] = []) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations,
    });
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
}

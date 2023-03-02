import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    private userService: UserService,
  ) {}
  create(createUsersActivityDto: CreateUsersActivityDto) {
    return 'This action adds a new usersActivity';
  }

  findAll() {
    return `This action returns all usersActivity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersActivity`;
  }

  update(id: number, updateUsersActivityDto: UpdateUsersActivityDto) {
    return `This action updates a #${id} usersActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersActivity`;
  }
}

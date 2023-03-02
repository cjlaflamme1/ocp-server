import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityTypeDto } from './dto/create-activity-type.dto';
import { UpdateActivityTypeDto } from './dto/update-activity-type.dto';
import { ActivityType } from './entities/activity-type.entity';

@Injectable()
export class ActivityTypesService {
  constructor(
    @InjectRepository(ActivityType)
    private activityTypeRepository: Repository<ActivityType>,
  ) {}
  create(createActivityTypeDto: CreateActivityTypeDto) {
    return 'This action adds a new activityType';
  }

  findAll() {
    return `This action returns all activityTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activityType`;
  }

  update(id: number, updateActivityTypeDto: UpdateActivityTypeDto) {
    return `This action updates a #${id} activityType`;
  }

  remove(id: number) {
    return `This action removes a #${id} activityType`;
  }
}

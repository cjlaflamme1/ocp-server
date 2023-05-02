import { Injectable } from '@nestjs/common';
import { CreateGroupEventDto } from './dto/create-group-event.dto';
import { UpdateGroupEventDto } from './dto/update-group-event.dto';

@Injectable()
export class GroupEventService {
  create(createGroupEventDto: CreateGroupEventDto) {
    return 'This action adds a new groupEvent';
  }

  findAll() {
    return `This action returns all groupEvent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupEvent`;
  }

  update(id: number, updateGroupEventDto: UpdateGroupEventDto) {
    return `This action updates a #${id} groupEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupEvent`;
  }
}

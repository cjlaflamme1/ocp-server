import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupInvitationDto } from './dto/create-group-invitation.dto';
import { UpdateGroupInvitationDto } from './dto/update-group-invitation.dto';
import { GroupInvitation } from './entities/group-invitation.entity';

@Injectable()
export class GroupInvitationService {
  constructor(
    @InjectRepository(GroupInvitation)
    private groupInvitationRepository: Repository<GroupInvitation>,
  ) {}
  create(createGroupInvitationDto: CreateGroupInvitationDto) {
    return 'This action adds a new groupInvitation';
  }

  findAll() {
    return `This action returns all groupInvitation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupInvitation`;
  }

  update(id: number, updateGroupInvitationDto: UpdateGroupInvitationDto) {
    return `This action updates a #${id} groupInvitation`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupInvitation`;
  }
}

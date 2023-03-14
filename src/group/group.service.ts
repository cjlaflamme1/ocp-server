import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupInvitationDto } from 'src/group-invitation/dto/create-group-invitation.dto';
import { returnRelationsObject } from 'src/helpers/relationArrayToObject';
import {
  DbQueryService,
  QueryDetails,
} from 'src/services/db-query/db-query.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateGroupDto, IncomingGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private userService: UserService,
    private dbQueryService: DbQueryService,
  ) {}
  async create(createGroupDto: IncomingGroupDto, requestByEmail: string) {
    const creator = await this.userService.findOneByEmail(requestByEmail);
    const newGroup: CreateGroupDto = {
      coverPhoto: createGroupDto.coverPhoto,
      title: createGroupDto.title,
      description: createGroupDto.description,
      groupAdmins: [creator],
      pendingInvitations:
        createGroupDto.pendingInvitationUserIds &&
        createGroupDto.pendingInvitationUserIds.length > 0
          ? await Promise.all(
              createGroupDto.pendingInvitationUserIds.map(async (inviteId) => {
                const user = await this.userService.findOneNoImage(inviteId);
                const pendingInvite: CreateGroupInvitationDto = {
                  invitedUser: user,
                  invitedBy: creator,
                };
                return pendingInvite;
              }),
            )
          : null,
    };
    return this.groupRepository.save(newGroup);
  }

  findAll(queryFormatted: QueryDetails, relations: string[] = []) {
    const query = this.dbQueryService.queryBuilder(queryFormatted);
    return this.groupRepository.findAndCount({
      ...query,
      relations: returnRelationsObject(relations),
    });
  }

  findOne(id: string) {
    return this.groupRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}

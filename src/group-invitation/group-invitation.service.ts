import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { group } from 'console';
import { GroupService } from 'src/group/group.service';
import { returnRelationsObject } from 'src/helpers/relationArrayToObject';
import { S3Service } from 'src/services/s3/s3.service';
import { UserService } from 'src/user/user.service';
import { IsNull, Repository } from 'typeorm';
import {
  CreateGroupInvitationDto,
  IncomingInviteExistingGroupDto,
} from './dto/create-group-invitation.dto';
import { UpdateGroupInvitationDto } from './dto/update-group-invitation.dto';
import { GroupInvitation } from './entities/group-invitation.entity';

@Injectable()
export class GroupInvitationService {
  constructor(
    @InjectRepository(GroupInvitation)
    private groupInvitationRepository: Repository<GroupInvitation>,
    private s3Service: S3Service,
    private groupService: GroupService,
    private userService: UserService,
  ) {}
  async create(
    createGroupInvitationDto: IncomingInviteExistingGroupDto,
    invitedByEmail: string,
  ) {
    const group = await this.groupService.findOne(
      createGroupInvitationDto.groupId,
    );
    const invites = await Promise.all(
      createGroupInvitationDto.userIds.map(async (userId) => {
        const invite = await this.groupInvitationRepository.save({
          group,
          invitedUser: await this.userService.findOneNoImage(userId),
          invitedBy: await this.userService.findOneByEmail(invitedByEmail),
        });
        return invite;
      }),
    );
    return invites;
  }

  async findAll(userEmail: string, relations: string[] = []) {
    const invitations = await this.groupInvitationRepository.find({
      where: {
        invitedUser: {
          email: userEmail,
        },
        accepted: IsNull(),
      },
      relations: returnRelationsObject(relations),
    });
    if (invitations && invitations.length > 0) {
      const repackaged = await Promise.all(
        invitations.map(async (invitation) => {
          const newInvite: any = { ...invitation };
          let imageGetUrl = '';
          if (invitation.group && invitation.group.coverPhoto) {
            imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
              invitation.group.coverPhoto,
            );
          }
          newInvite.group = { ...invitation.group, imageGetUrl };
          return newInvite;
        }),
      );
      return repackaged;
    }
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} groupInvitation`;
  }

  async update(id: string, updateGroupInvitationDto: UpdateGroupInvitationDto) {
    const invite = await this.groupInvitationRepository.findOne({
      where: {
        id,
      },
      relations: {
        group: true,
        invitedUser: true,
      },
    });
    if (
      invite &&
      invite.group &&
      !invite.accepted &&
      updateGroupInvitationDto.accepted
    ) {
      await this.groupService.addUserToGroup(
        invite.invitedUser.id,
        invite.group.id,
      );
    }
    return this.groupInvitationRepository.save({
      id,
      ...updateGroupInvitationDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} groupInvitation`;
  }
}

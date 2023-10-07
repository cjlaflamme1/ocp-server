import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupInvitationDto } from 'src/group-invitation/dto/create-group-invitation.dto';
import { returnRelationsObject } from 'src/helpers/relationArrayToObject';
import {
  DbQueryService,
  QueryDetails,
} from 'src/services/db-query/db-query.service';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';
import { S3Service } from 'src/services/s3/s3.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateGroupDto, IncomingGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private userService: UserService,
    private dbQueryService: DbQueryService,
    private s3Service: S3Service,
    private pushNotificationService: PushNotificationService,
    private notificationsService: NotificationsService,
  ) {}
  logger = new Logger(GroupService.name);

  async create(createGroupDto: IncomingGroupDto, requestByEmail: string) {
    const creator = await this.userService.findOneByEmail(requestByEmail);
    const newGroup: CreateGroupDto = {
      coverPhoto: createGroupDto.coverPhoto,
      title: createGroupDto.title,
      description: createGroupDto.description,
      location: createGroupDto.location,
      groupAdmins: [creator],
      users: [creator],
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
    if (
      createGroupDto.pendingInvitationUserIds &&
      createGroupDto.pendingInvitationUserIds.length > 0
    ) {
      this.pushNotificationService.sendNotifications(
        createGroupDto.pendingInvitationUserIds,
        {
          title: `You have been invited to: ${createGroupDto.title} `,
          body: `You have been invited to ${createGroupDto.title} by ${creator.firstName} ${creator.lastName}.  Open the app and navigate groups to accept or deny.`,
        },
      );
      this.notificationsService.createInviteNotifications(
        {
          title: 'Group Invitation',
          description: `You have been invited to ${createGroupDto.title} by ${creator.firstName} ${creator.lastName}.`,
          invite: true,
          user: null,
        },
        createGroupDto.pendingInvitationUserIds,
      );
    }
    return this.groupRepository.save(newGroup);
  }

  async findUserGroups(
    userEmail: string,
    queryFormatted: QueryDetails,
    relations: string[] = [],
  ) {
    const query = this.dbQueryService.queryBuilder(queryFormatted);
    query['where'] = {
      users: {
        email: userEmail,
      },
      ...query['where'],
    };
    const userGroups = await this.groupRepository.findAndCount({
      ...query,
      relations: returnRelationsObject(relations),
    });
    if (userGroups && userGroups[1] > 0) {
      const formattedGroups = await Promise.all(
        userGroups[0].map(async (group) => {
          if (group) {
            let imageGetUrl = '';
            if (group.coverPhoto) {
              imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
                group.coverPhoto,
              );
            }
            return { ...group, imageGetUrl };
          }
        }),
      );
      return {
        groups: formattedGroups,
        count: userGroups[1],
      };
    }
    return {
      groups: userGroups[0],
      count: userGroups[1],
    };
  }

  async findAll(queryFormatted: QueryDetails, relations: string[] = []) {
    const query = this.dbQueryService.queryBuilder(queryFormatted);
    const allGroups = await this.groupRepository.findAndCount({
      ...query,
      relations: returnRelationsObject(relations),
    });
    if (allGroups && allGroups[1] > 0) {
      const formattedGroups = await Promise.all(
        allGroups[0].map(async (group) => {
          if (group) {
            let imageGetUrl = '';
            if (group.coverPhoto) {
              imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
                group.coverPhoto,
              );
            }
            return { ...group, imageGetUrl };
          }
        }),
      );
      return {
        groups: formattedGroups,
        count: allGroups[1],
      };
    }
    return {
      groups: allGroups[0],
      count: allGroups[1],
    };
  }

  async findOne(id: string, relations: string[] = []) {
    const group = await this.groupRepository.findOne({
      where: {
        id: id,
      },
      relations: returnRelationsObject(relations),
    });
    if (group) {
      let imageGetUrl = '';
      if (group.coverPhoto) {
        imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
          group.coverPhoto,
        );
      }
      const formattedUser = [];
      if (group.users && group.users.length > 0) {
        await Promise.all(
          group.users.map(async (user) => {
            if (user) {
              let imageGetUrl = '';
              if (user.profilePhoto) {
                imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
                  user.profilePhoto,
                );
              }
              formattedUser.push({ ...user, imageGetUrl });
            }
          }),
        );
      }
      group.users = formattedUser;
      const formattedAdmin = [];
      if (group.groupAdmins && group.groupAdmins.length > 0) {
        await Promise.all(
          group.groupAdmins.map(async (user) => {
            if (user) {
              let imageGetUrl = '';
              if (user.profilePhoto) {
                imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
                  user.profilePhoto,
                );
              }
              formattedAdmin.push({ ...user, imageGetUrl });
            }
          }),
        );
      }
      group.groupAdmins = formattedAdmin;
      return { ...group, imageGetUrl };
    }
    throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
  }

  async findOneGroupEntity(id: string, relations: string[] = []) {
    return this.groupRepository.findOne({
      where: {
        id: id,
      },
      relations: returnRelationsObject(relations),
    });
  }

  async addUserToGroup(userId: string, groupId: string) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: {
        users: true,
      },
    });
    const user = await this.userService.findOneNoImage(userId);
    if (user && group) {
      const userList = group.users;
      userList.push(user);
      const groupUpdated = await this.groupRepository.save({
        id: group.id,
        users: userList,
      });
      return groupUpdated;
    }
    return null;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        users: true,
        groupAdmins: true,
      },
    });
    if (group) {
      if (
        updateGroupDto.addingUserIds &&
        updateGroupDto.addingUserIds.length > 0
      ) {
        const users = await this.userService.findSeveralUsers(
          updateGroupDto.addingUserIds,
        );
        const existingUsers = group.users ? group.users : [];
        existingUsers.push(...users);
        return this.groupRepository.save({
          id: group.id,
          users: existingUsers,
          ...updateGroupDto,
        });
      } else if (
        updateGroupDto.removeUserIds &&
        updateGroupDto.removeUserIds.length > 0
      ) {
        const existingUsers = group.users.filter(
          (u) => !updateGroupDto.removeUserIds.includes(u.id),
        );
        return this.groupRepository.save({
          id: group.id,
          users: existingUsers,
          ...updateGroupDto,
        });
      } else {
        return this.groupRepository.save({
          id: group.id,
          ...updateGroupDto,
        });
      }
    }
    throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { GroupService } from 'src/group/group.service';
import { returnRelationsObject } from 'src/helpers/relationArrayToObject';
import {
  DbQueryService,
  QueryDetails,
} from 'src/services/db-query/db-query.service';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';
import { S3Service } from 'src/services/s3/s3.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  CreateGroupEventDto,
  IncomingCreateGroupEventDto,
} from './dto/create-group-event.dto';
import { UpdateGroupEventDto } from './dto/update-group-event.dto';
import { GroupEvent } from './entities/group-event.entity';

@Injectable()
export class GroupEventService {
  constructor(
    @InjectRepository(GroupEvent)
    private groupEventRepository: Repository<GroupEvent>,
    private userService: UserService,
    private groupService: GroupService,
    private notificationService: PushNotificationService,
    private dbQueryService: DbQueryService,
    private s3Service: S3Service,
  ) {}
  async create(createGroupEventDto: IncomingCreateGroupEventDto) {
    const createdBy: User = await this.userService.findOneByEmail(
      createGroupEventDto.creatorEmail,
    );
    const group: Group = await this.groupService.findOneGroupEntity(
      createGroupEventDto.groupId,
      ['users', 'groupAdmins'],
    );
    const newEvent: CreateGroupEventDto = {
      title: createGroupEventDto.title,
      description: createGroupEventDto.description,
      creator: createdBy,
      group,
      coverPhoto: createGroupEventDto.coverPhoto,
      eventDate: createGroupEventDto.eventDate,
    };
    const createdEvent = await this.groupEventRepository.save(newEvent);
    if (createdEvent) {
      const userIds: string[] = [];
      if (group.users && group.users.length) {
        const userList = group.users.map((user) => user.id);
        userIds.push(...userList);
      }
      if (group.groupAdmins && group.groupAdmins.length) {
        const adminList = group.groupAdmins.map((user) => user.id);
        userIds.push(...adminList);
      }
      if (userIds.length) {
        this.notificationService.sendNotifications([...new Set(userIds)], {
          title: `${group.title} has a new event!`,
          body: `${group.title} has a new event. ${createdEvent.title} has been added to the calendar by ${createdBy.firstName}. Log into the group to learn more and join!`,
        });
      }
    }
    return createdEvent;
  }

  async findAll(queryFormatted: QueryDetails, relations: string[] = []) {
    const query = this.dbQueryService.queryBuilder(queryFormatted);
    const groupEvents = await this.groupEventRepository.findAndCount({
      ...query,
      relations: returnRelationsObject(relations),
      select: {
        id: true,
        coverPhoto: true,
        title: true,
        createdAt: true,
        creator: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
        attendingUsers: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    });
    if (groupEvents && groupEvents[1] > 0) {
      const formattedEvents = await Promise.all(
        groupEvents[0].map(async (event) => {
          let imageGetUrl = '';
          if (event.coverPhoto) {
            imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
              event.coverPhoto,
            );
          }
          return { ...event, imageGetUrl };
        }),
      );
      return {
        groupEvents: formattedEvents,
        count: groupEvents[1],
      };
    }
    return {
      groupEvents: groupEvents[0],
      count: groupEvents[1],
    };
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

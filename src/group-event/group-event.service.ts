import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { FindOptionsRelations, Repository } from 'typeorm';
import {
  CreateGroupEventDto,
  IncomingCreateGroupEventDto,
} from './dto/create-group-event.dto';
import { UpdateGroupEventDto } from './dto/update-group-event.dto';
import { GroupEvent } from './entities/group-event.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class GroupEventService {
  constructor(
    @InjectRepository(GroupEvent)
    private groupEventRepository: Repository<GroupEvent>,
    private userService: UserService,
    private groupService: GroupService,
    private pushNotificationService: PushNotificationService,
    private notificationsService: NotificationsService,
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
        this.pushNotificationService.sendNotifications([...new Set(userIds)], {
          title: `${group.title} has a new event!`,
          body: `${group.title} has a new event. ${createdEvent.title} has been added to the calendar by ${createdBy.firstName}. Log into the group to learn more and join!`,
        });
        this.notificationsService.createInviteNotifications(
          {
            title: 'New Event',
            description: `${group.title} has a new event. ${createdEvent.title} has been added to the calendar by ${createdBy.firstName}. Log into the group to learn more and join!`,
            eventId: createdEvent.id,
            user: null,
          },
          userIds,
        );
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
        eventDate: true,
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
          let repackagedCreator = null;
          if (event.creator) {
            let imageGetUrl = '';
            if (event.creator.profilePhoto) {
              imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
                event.creator.profilePhoto,
              );
            }
            repackagedCreator = {
              ...event.creator,
              imageGetUrl,
            };
            event.creator = repackagedCreator;
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

  async findOne(id: string, relations: FindOptionsRelations<GroupEvent> = {}) {
    const currentEvent = await this.groupEventRepository.findOne({
      where: {
        id,
      },
      relations,
    });
    if (currentEvent) {
      let imageGetUrl = '';
      if (currentEvent.coverPhoto) {
        imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
          currentEvent.coverPhoto,
        );
      }
      const formattedUser = [];
      if (
        currentEvent.attendingUsers &&
        currentEvent.attendingUsers.length > 0
      ) {
        await Promise.all(
          currentEvent.attendingUsers.map(async (user) => {
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
      let formattedCreator = null;
      if (currentEvent.creator) {
        let imageGetUrl = '';
        if (currentEvent.creator.profilePhoto) {
          imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
            currentEvent.creator.profilePhoto,
          );
        }
        formattedCreator = { ...currentEvent.creator, imageGetUrl };
      }
      if (currentEvent.responses && currentEvent.responses.length > 0) {
        const repackagedResponses = [];
        await Promise.all(
          currentEvent.responses.map(async (response) => {
            let imageGetUrl = '';
            if (response.author && response.author.profilePhoto) {
              let repackedAuthor = null;
              imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
                response.author.profilePhoto,
              );
              repackedAuthor = {
                ...response.author,
                imageGetUrl,
              };
              response.author = repackedAuthor;
            }
            repackagedResponses.push({
              ...response,
            });
          }),
        );
        currentEvent.responses = repackagedResponses;
      }
      currentEvent.creator = formattedCreator;
      currentEvent.attendingUsers = formattedUser;
      return { ...currentEvent, imageGetUrl };
    }
    throw new HttpException('No Event Found', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateGroupEventDto: UpdateGroupEventDto) {
    if (updateGroupEventDto.attendingUserIds) {
      const currentEvent = await this.groupEventRepository.findOne({
        where: {
          id,
        },
        relations: {
          attendingUsers: true,
        },
      });
      const newUsers = await Promise.all(
        updateGroupEventDto.attendingUserIds.map(async (userid) => {
          const user = await this.userService.findOneNoImage(userid);
          return user;
        }),
      );
      await this.groupEventRepository.save({
        ...currentEvent,
        attendingUsers: [
          ...new Set([...(currentEvent.attendingUsers || []), ...newUsers]),
        ],
      });
      return HttpStatus.CREATED;
    }
    return `This action updates a #${id} groupEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupEvent`;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupPostService } from 'src/group-post/group-post.service';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { IncomingCreateResDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { Response } from './entities/response.entity';
import { GroupEventService } from 'src/group-event/group-event.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import filterAndUniqueIdArray from 'src/helpers/filterAndUniqueArray';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    private userService: UserService,
    private groupPostService: GroupPostService,
    private pushNotificationService: PushNotificationService,
    private notificationsService: NotificationsService,
    private groupEventService: GroupEventService,
  ) {}
  async create(createResponseDto: IncomingCreateResDto, authorEmail: string) {
    const userIds: string[] = [];
    const author = await this.userService.findOneByEmail(authorEmail);
    if (createResponseDto.groupPostId) {
      const groupPost = await this.groupPostService.findOne(
        createResponseDto.groupPostId,
        {
          author: true,
          responses: {
            author: true,
          },
          group: true,
        },
      );
      if (groupPost.author) {
        userIds.push(groupPost.author.id);
      }
      if (groupPost.responses && groupPost.responses.length > 0) {
        groupPost.responses.map((response) => {
          if (response.author) {
            userIds.push(response.author.id);
          }
        });
      }
      const filteredIds = filterAndUniqueIdArray(userIds, [author.id]);
      this.pushNotificationService.sendNotifications(filteredIds, {
        title: `New Response`,
        body: `There is a new response from ${author.firstName} in a thread you're involved in. Visit: ${groupPost.group.title} to view`,
      });
      this.notificationsService.createInviteNotifications(
        {
          title: 'New Response',
          description: `There is a new response from ${author.firstName} in a thread you're involved in.`,
          postId: groupPost.id,
          user: null,
        },
        filteredIds,
      );
      return this.responseRepository.save({
        responseText: createResponseDto.responseText,
        author,
        groupPost,
      });
    }
    if (createResponseDto.groupEventId) {
      const groupEvent = await this.groupEventService.findOne(
        createResponseDto.groupEventId,
        {
          creator: true,
          attendingUsers: true,
        },
      );
      if (groupEvent.creator) {
        userIds.push(groupEvent.creator.id);
      }
      if (groupEvent.attendingUsers && groupEvent.attendingUsers.length > 0) {
        groupEvent.attendingUsers.map((user) => userIds.push(user.id));
      }
      const filteredIds = filterAndUniqueIdArray(userIds, [author.id]);
      this.pushNotificationService.sendNotifications(filteredIds, {
        title: `New Event Response`,
        body: `There is a new response from ${author.firstName} in an Event you're involved in. Visit: ${groupEvent.title} to view`,
      });
      return this.responseRepository.save({
        responseText: createResponseDto.responseText,
        author,
        groupEvent,
      });
    }
  }

  // findAll() {
  //   return `This action returns all response`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} response`;
  // }

  // update(id: number, updateResponseDto: UpdateResponseDto) {
  //   return `This action updates a #${id} response`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} response`;
  // }
}

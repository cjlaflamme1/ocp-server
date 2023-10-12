import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GroupEvent } from 'src/group-event/entities/group-event.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UserService,
  ) {}
  logger = new Logger(NotificationsService.name);

  create(createNotificationDtos: CreateNotificationDto[]) {
    try {
      return this.notificationRepository.save(createNotificationDtos);
    } catch (err) {
      this.logger.log(err);
    }
  }

  async createInviteNotifications(
    createNotificationDto: CreateNotificationDto,
    userIds: string[],
  ) {
    return Promise.all(
      userIds.map(async (userId) => {
        return this.notificationRepository.save({
          ...createNotificationDto,
          user: await this.userService.findOneNoImage(userId),
        });
      }),
    );
  }

  alertEventCancelled(event: GroupEvent) {
    if (event && event.attendingUsers && event.attendingUsers.length > 0) {
      const notifications: CreateNotificationDto[] = event.attendingUsers.map(
        (user) => ({
          title: `${event.title} Cancelled`,
          description: `${event.title} has been cancelled on ${new Date()}`,
          eventId: event.id,
          user,
        }),
      );
      return this.notificationRepository.save(notifications);
    }
  }

  async findAll(userEmail: string) {
    const currentUser = await this.userService.findOneByEmail(userEmail);
    const currentDate = new Date();
    const threeDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 3),
    );
    if (currentUser) {
      const notices = await this.notificationRepository.find({
        relations: {
          user: true,
        },
        where: {
          user: {
            id: currentUser.id,
          },
          createdAt: MoreThanOrEqual(threeDaysAgo),
        },
      });
      return notices;
    }
    return null;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} notification`;
  // }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const note = await this.notificationRepository.findOne({
      where: {
        id: id,
      },
    });
    return this.notificationRepository.save({
      ...note,
      ...updateNotificationDto,
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }
}

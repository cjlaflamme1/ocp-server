import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

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

  async findAll(userEmail: string) {
    const currentUser = await this.userService.findOneByEmail(userEmail);
    const currentDate = new Date();
    const threeDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 3),
    );
    return this.notificationRepository.find({
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

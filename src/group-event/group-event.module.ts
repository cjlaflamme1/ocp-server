import { Module } from '@nestjs/common';
import { GroupEventService } from './group-event.service';
import { GroupEventController } from './group-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEvent } from './entities/group-event.entity';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';
import { DbQueryService } from 'src/services/db-query/db-query.service';
import { S3Service } from 'src/services/s3/s3.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEvent]),
    UserModule,
    GroupModule,
    NotificationsModule,
  ],
  exports: [GroupEventService],
  controllers: [GroupEventController],
  providers: [
    GroupEventService,
    PushNotificationService,
    DbQueryService,
    S3Service,
  ],
})
export class GroupEventModule {}

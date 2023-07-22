import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response } from './entities/response.entity';
import { UserModule } from 'src/user/user.module';
import { GroupPostModule } from 'src/group-post/group-post.module';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';
import { GroupEventModule } from 'src/group-event/group-event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Response]),
    UserModule,
    GroupPostModule,
    GroupEventModule,
  ],
  exports: [ResponseService],
  controllers: [ResponseController],
  providers: [ResponseService, PushNotificationService],
})
export class ResponseModule {}

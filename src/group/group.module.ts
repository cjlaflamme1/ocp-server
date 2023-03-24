import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { UserModule } from 'src/user/user.module';
import { DbQueryService } from 'src/services/db-query/db-query.service';
import { S3Service } from 'src/services/s3/s3.service';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), UserModule],
  exports: [GroupService],
  controllers: [GroupController],
  providers: [GroupService, DbQueryService, S3Service, PushNotificationService],
})
export class GroupModule {}

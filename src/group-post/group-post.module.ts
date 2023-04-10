import { Module } from '@nestjs/common';
import { GroupPostService } from './group-post.service';
import { GroupPostController } from './group-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPost } from './entities/group-post.entity';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';
import { S3Service } from 'src/services/s3/s3.service';
import { DbQueryService } from 'src/services/db-query/db-query.service';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupPost]), UserModule, GroupModule],
  exports: [GroupPostService],
  controllers: [GroupPostController],
  providers: [
    GroupPostService,
    S3Service,
    DbQueryService,
    PushNotificationService,
  ],
})
export class GroupPostModule {}

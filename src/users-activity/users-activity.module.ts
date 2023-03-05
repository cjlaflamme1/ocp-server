import { Module } from '@nestjs/common';
import { UsersActivityService } from './users-activity.service';
import { UsersActivityController } from './users-activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersActivity } from './entities/users-activity.entity';
import { S3Service } from 'src/services/s3/s3.service';
import { UserModule } from 'src/user/user.module';
import { ActivityTypesModule } from 'src/activity-types/activity-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersActivity]),
    UserModule,
    ActivityTypesModule,
  ],
  exports: [UsersActivityService],
  controllers: [UsersActivityController],
  providers: [UsersActivityService, S3Service],
})
export class UsersActivityModule {}

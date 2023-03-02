import { Module } from '@nestjs/common';
import { UsersActivityService } from './users-activity.service';
import { UsersActivityController } from './users-activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersActivity } from './entities/users-activity.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersActivity]), UserModule],
  exports: [UsersActivityService],
  controllers: [UsersActivityController],
  providers: [UsersActivityService],
})
export class UsersActivityModule {}

import { Module } from '@nestjs/common';
import { GroupPostService } from './group-post.service';
import { GroupPostController } from './group-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPost } from './entities/group-post.entity';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';
import { S3Service } from 'src/services/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupPost]), UserModule, GroupModule],
  exports: [GroupPostService],
  controllers: [GroupPostController],
  providers: [GroupPostService, S3Service],
})
export class GroupPostModule {}

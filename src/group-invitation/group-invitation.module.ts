import { Module } from '@nestjs/common';
import { GroupInvitationService } from './group-invitation.service';
import { GroupInvitationController } from './group-invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupInvitation } from './entities/group-invitation.entity';
import { S3Service } from 'src/services/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupInvitation])],
  exports: [GroupInvitationService],
  controllers: [GroupInvitationController],
  providers: [GroupInvitationService, S3Service],
})
export class GroupInvitationModule {}

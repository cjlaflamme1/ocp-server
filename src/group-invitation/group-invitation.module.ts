import { Module } from '@nestjs/common';
import { GroupInvitationService } from './group-invitation.service';
import { GroupInvitationController } from './group-invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupInvitation } from './entities/group-invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupInvitation])],
  exports: [GroupInvitationService],
  controllers: [GroupInvitationController],
  providers: [GroupInvitationService],
})
export class GroupInvitationModule {}

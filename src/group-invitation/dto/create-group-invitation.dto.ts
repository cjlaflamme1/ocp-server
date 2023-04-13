import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';

export class IncomingInviteExistingGroupDto {
  groupId: string;
  userIds: string[];
}

export class IncomingGroupInvitationDto {
  message?: string;
  invitedUserId: string;
  invitedById: string;
  groupId: string;
}
export class CreateGroupInvitationDto {
  message?: string;
  invitedUser: User;
  invitedBy: User;
  group?: Group;
}

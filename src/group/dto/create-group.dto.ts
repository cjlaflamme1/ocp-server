import { CreateGroupInvitationDto } from 'src/group-invitation/dto/create-group-invitation.dto';
import { GroupInvitation } from 'src/group-invitation/entities/group-invitation.entity';
import { User } from 'src/user/entities/user.entity';

export class IncomingGroupDto {
  coverPhoto: string | null;
  title: string;
  location?: string;
  description: string;
  groupAdminIds: string[];
  pendingInvitationUserIds?: string[];
}

export class CreateGroupDto {
  coverPhoto: string | null;
  title: string;
  location?: string;
  description: string;
  groupAdmins: User[];
  users?: User[];
  pendingInvitations?: GroupInvitation[] | CreateGroupInvitationDto[] | null;
}

import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';

export class IncomingCreateGroupEventDto {
  eventDate: Date;
  title: string;
  description: string;
  groupId: string;
  creatorEmail: string;
  coverPhoto: string;
}

export class CreateGroupEventDto {
  eventDate: Date;
  coverPhoto: string | null;
  title: string;
  description: string | null;
  cancelled?: boolean;
  creator: User;
  group: Group;
  attendingUsers?: User[];
}

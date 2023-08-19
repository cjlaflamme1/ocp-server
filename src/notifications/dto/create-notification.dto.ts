import { User } from 'src/user/entities/user.entity';

export class CreateNotificationDto {
  title: string;
  description: string;
  groupId?: string;
  postId?: string;
  eventId?: string;
  invite?: boolean;
  user: User;
}

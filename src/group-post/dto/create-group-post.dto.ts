import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateGroupPostDto {
  image?: string;
  postText?: string;
  groupId: string;
  author: User;
  group: Group;
}

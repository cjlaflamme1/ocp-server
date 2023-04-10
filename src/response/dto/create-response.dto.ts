import { GroupPost } from 'src/group-post/entities/group-post.entity';
import { User } from 'src/user/entities/user.entity';

export class IncomingCreateResDto {
  responseText: string;
  groupPostId: string;
}

export class CreateResponseDto {
  responseText: string;
  groupPost: GroupPost;
  author: User;
}

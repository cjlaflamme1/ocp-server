import { GroupEvent } from 'src/group-event/entities/group-event.entity';
import { GroupPost } from 'src/group-post/entities/group-post.entity';
import { User } from 'src/user/entities/user.entity';

export class IncomingCreateResDto {
  responseText: string;
  groupPostId?: string;
  groupEventId?: string;
}

export class CreateResponseDto {
  responseText: string;
  groupPost?: GroupPost;
  groupEvent?: GroupEvent;
  author: User;
}

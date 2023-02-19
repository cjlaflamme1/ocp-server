import { User } from 'src/user/entities/user.entity';

export class CreateLosenordDto {
  user: User;
  losenord: string;
}

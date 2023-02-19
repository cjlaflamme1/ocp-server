import { User } from 'src/user/entities/user.entity';

export class CreateRefreshTokenDto {
  user: User;
  token: string;
}

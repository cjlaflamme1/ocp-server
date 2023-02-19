import { Losenord } from 'src/losenord/entities/losenord.entity';

export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  losenord: string;
}

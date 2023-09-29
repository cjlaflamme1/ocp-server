import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(private userService: UserService) {}

  async healthCheck(): Promise<HttpStatus> {
    const dbTest = this.userService.dbTest();
    if (dbTest) {
      return HttpStatus.OK;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(private userService: UserService) {}

  async healthCheck(): Promise<HttpStatus> {
    const dbTest = await this.userService.dbTest();
    if (dbTest && dbTest.length > 0) {
      return HttpStatus.OK;
    }
    throw new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

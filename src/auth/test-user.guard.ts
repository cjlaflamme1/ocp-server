import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TestUserGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}
  private testUserId = this.configService.get<string>('TEST_USER_ID');
  private readonly logger = new Logger(TestUserGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return new Promise<boolean>((resolve) => {
      if (!this.testUserId) {
        resolve(true);
      }
      this.userService
        .findOneByEmail(user.email)
        .then((user) => {
          if (user.id && user.id === this.testUserId) {
            this.logger.log('User Blocked from posting');
            resolve(false);
          }
          resolve(true);
        })
        .catch((err) => {
          this.logger.log(err);
          resolve(true);
        });
    });
  }
}

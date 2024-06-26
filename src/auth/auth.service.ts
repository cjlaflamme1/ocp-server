import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ResetRequestService } from 'src/reset-request/reset-request.service';
import { MailerService } from 'src/services/mailer/mailer.service';
import { ResetPasswordDTO } from './dto/reset.dto';
import { LosenordService } from 'src/losenord/losenord.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private configService: ConfigService,
    private resetRequestService: ResetRequestService,
    private mailerService: MailerService,
    private losenordService: LosenordService,
  ) {}
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshAuth =
    this.configService.get<string>('X-REQUEST-RESET');

  async signUp(user: CreateUserDto) {
    const userCheck = await this.userService.findOneByEmail(user.email);
    if (userCheck) {
      throw new HttpException(
        'This email already has an account, please login.',
        HttpStatus.CONFLICT,
      );
    }
    user.losenord = await bcrypt.hash(user.password, saltOrRounds);

    const { id, email } = await this.userService.create(user);
    const payload = { email: email, sub: id };

    const refreshToken = this.jwtService.sign(
      { email: payload.email },
      {
        expiresIn: '7d',
      },
    );
    await this.refreshTokenService.create(payload.email, refreshToken);

    return {
      email: payload.email,
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken,
    };
  }

  async login(user: User) {
    const { email, id } = user;
    const payload = { email: email, sub: id };

    const refreshToken = this.jwtService.sign(
      { email: payload.email },
      {
        expiresIn: '7d',
      },
    );
    await this.refreshTokenService.create(payload.email, refreshToken);
    return {
      email: payload.email,
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken,
    };
  }

  async createAccessTokenFromRefreshToken(refresh: any) {
    try {
      const decoded: any = this.jwtService.decode(refresh);

      if (!decoded) {
        throw new Error();
      }

      const user = await this.userService.findOneByEmail(decoded.email);
      if (!user) {
        throw new HttpException(
          'User with this email does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const userRefreshTokens = await this.refreshTokenService.findByUser(user);
      let matchingRefreshToken = '';
      await Promise.all(
        userRefreshTokens.map(async (userToken) => {
          const isMatching = await bcrypt.compare(refresh, userToken.token);
          if (isMatching) {
            matchingRefreshToken = userToken.token;
            return;
          }
          return;
        }),
      );

      if (!matchingRefreshToken) {
        throw new UnauthorizedException('Invalid Token');
      }
      return {
        refreshToken: this.jwtService.sign({
          email: user.email,
          nameID: user.firstName + ' ' + user.lastName,
          nameIDFormat: 'first name + last name',
        }),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.userLogIn(email);
    if (user && user.losenord && user.losenord.length > 0 && user.losenord[0]) {
      const match = await bcrypt.compare(pass, user.losenord[0].losenord);
      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { losenord, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async reqReset(email: string, headerToken: string): Promise<any> {
    if (headerToken && this.refreshAuth && headerToken === this.refreshAuth) {
      const user = await this.userService.findOneByEmail(email);
      // TODO add user reset stuff
      if (user) {
        const newToken = await this.resetRequestService.create(user);
        if (newToken) {
          await this.mailerService.resetPassword(
            user.email,
            newToken.resetToken,
          );
          return { email: user.email };
        }
      }
      return new HttpException('Failed', HttpStatus.EXPECTATION_FAILED);
    }
    return new UnauthorizedException('Invalid request');
  }

  async submitReset(
    resetDTO: ResetPasswordDTO,
    headerToken: string,
  ): Promise<any> {
    if (headerToken && this.refreshAuth && headerToken === this.refreshAuth) {
      const userResetTokens = await this.resetRequestService.findAll(
        resetDTO.email,
      );

      if (userResetTokens && userResetTokens.length > 0) {
        const currentToken = userResetTokens.find(
          (t) => t.resetToken === resetDTO.token,
        );
        if (currentToken) {
          // reset password
          const user = await this.userService.findOneByEmail(resetDTO.email);
          const hashedPw = await bcrypt.hash(resetDTO.password, saltOrRounds);
          const newPw = await this.losenordService.createNew(hashedPw, user);
          if (newPw) {
            this.resetRequestService.deleteForUser(user.email);
            return HttpStatus.OK;
          }
        }
      }
      return new HttpException('Failed', HttpStatus.EXPECTATION_FAILED);
    }
    return new UnauthorizedException('Invalid request');
  }
}

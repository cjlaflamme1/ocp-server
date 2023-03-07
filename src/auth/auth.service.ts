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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async signUp(user: CreateUserDto) {
    this.logger.log('signup service hit');
    const userCheck = await this.userService.findOneByEmail(user.email);
    if (userCheck) {
      throw new HttpException(
        'This email already has an account, please login.',
        HttpStatus.CONFLICT,
      );
    }
    this.logger.log('no user found, hashing pw');
    user.losenord = await bcrypt.hash(user.password, saltOrRounds);
    this.logger.log('creating user');
    const { id, email } = await this.userService.create(user);
    const payload = { email: email, sub: id };
    this.logger.log('creating refresh token');
    const refreshToken = this.jwtService.sign(
      { email: payload.email },
      {
        expiresIn: '7d',
      },
    );
    await this.refreshTokenService.create(payload.email, refreshToken);
    this.logger.log('returning payload');
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
    const match = await bcrypt.compare(pass, user.losenord[0].losenord);

    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { losenord, ...result } = user;
      return result;
    }
    return null;
  }
}

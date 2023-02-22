import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private userService: UserService,
  ) {}
  logger = new Logger(RefreshTokenService.name);

  async create(userEmail: string, newToken: string) {
    const hashedToken = await bcrypt.hash(newToken, 10);
    const user = await this.userService.findOneByEmail(userEmail);
    const newCreatedToken = await this.refreshTokenRepository.save({
      user,
      token: hashedToken,
    });
    this.logger.log(JSON.stringify(newCreatedToken));
    return newCreatedToken;
  }

  async findByUser(user: User) {
    const token: RefreshToken[] = await this.refreshTokenRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        user: true,
      },
    });
    this.logger.log(`Current Tokens: ${JSON.stringify(token)}`);
    return token;
  }

  findOne(id: string) {
    return this.refreshTokenRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    const token = await this.findOne(id);
    return this.refreshTokenRepository.softRemove(token);
  }
}

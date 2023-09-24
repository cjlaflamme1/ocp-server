import { Injectable, Logger } from '@nestjs/common';
import { CreateResetRequestDto } from './dto/create-reset-request.dto';
import { UpdateResetRequestDto } from './dto/update-reset-request.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetRequest } from './entities/reset-request.entity';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ResetRequestService {
  constructor(
    @InjectRepository(ResetRequest)
    private resetRequestRepository: Repository<ResetRequest>,
  ) {}
  logger = new Logger(ResetRequestService.name);

  create(user: User) {
    const minm = 100000;
    const maxm = 999999;
    const code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    return this.resetRequestRepository.save({
      resetToken: code,
      user,
    });
  }

  findAll(userEmail: string) {
    return this.resetRequestRepository.find({
      where: {
        user: {
          email: userEmail,
        },
      },
    });
  }

  async deleteForUser(userEmail: string) {
    const tokens = await this.findAll(userEmail);
    return this.resetRequestRepository.remove(tokens);
  }

  @Cron('0 */1 * * * *', {
    name: 'Delete Reset Tokens',
    timeZone: 'America/New_York',
  })
  async deleteExpiredTokens() {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);
    const toDelete = await this.resetRequestRepository.find({
      where: {
        createdAt: LessThanOrEqual(fifteenMinutesAgo),
      },
    });
    this.logger.log(JSON.stringify(toDelete));
    await this.resetRequestRepository.remove(toDelete);
  }
}

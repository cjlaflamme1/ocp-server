import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Losenord } from './entities/losenord.entity';

@Injectable()
export class LosenordService {
  constructor(
    @InjectRepository(Losenord)
    private losenordRepository: Repository<Losenord>,
  ) {}

  async findByUser(user: User) {
    const losenord: Losenord[] = await this.losenordRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    return losenord;
  }
}

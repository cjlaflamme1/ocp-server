import { Module } from '@nestjs/common';
import { LosenordService } from './losenord.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Losenord } from './entities/losenord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Losenord])],
  exports: [LosenordService],
  providers: [LosenordService],
})
export class LosenordModule {}

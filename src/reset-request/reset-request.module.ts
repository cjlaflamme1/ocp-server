import { Module } from '@nestjs/common';
import { ResetRequestService } from './reset-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetRequest } from './entities/reset-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetRequest])],
  providers: [ResetRequestService],
  exports: [ResetRequestService],
})
export class ResetRequestModule {}

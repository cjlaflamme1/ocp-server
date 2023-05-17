import { Module } from '@nestjs/common';
import { GroupEventService } from './group-event.service';
import { GroupEventController } from './group-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEvent } from './entities/group-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEvent])],
  exports: [GroupEventService],
  controllers: [GroupEventController],
  providers: [GroupEventService],
})
export class GroupEventModule {}

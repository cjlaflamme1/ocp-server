import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response } from './entities/response.entity';
import { UserModule } from 'src/user/user.module';
import { GroupPostModule } from 'src/group-post/group-post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Response]), UserModule, GroupPostModule],
  exports: [ResponseService],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}

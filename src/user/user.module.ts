import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LosenordModule } from 'src/losenord/losenord.module';
import { S3Service } from 'src/services/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LosenordModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, S3Service],
})
export class UserModule {}

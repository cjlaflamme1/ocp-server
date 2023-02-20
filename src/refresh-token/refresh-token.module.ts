import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), UserModule],
  exports: [RefreshTokenService],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}

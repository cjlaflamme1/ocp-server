import { resolve } from 'path';
import * as dotenv from 'dotenv';
dotenv.config({
  path: resolve(__dirname, '../../.env'),
  debug: true,
});
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

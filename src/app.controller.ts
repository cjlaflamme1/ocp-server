import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { S3Service } from './services/s3/s3.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private s3Service: S3Service,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('image/:fileName')
  @UseGuards(JwtAuthGuard)
  getImagePath(@Param('fileName') fileName: string) {
    return this.s3Service.getImageObjectSignedUrl(fileName);
  }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  uploadImagePath(
    @Body()
    imageData: {
      fileName: string;
      fileType: string;
      fileDirectory: string;
    },
  ) {
    return this.s3Service.putImageObjectSignedUrl(
      imageData.fileName,
      imageData.fileType,
      imageData.fileDirectory,
    );
  }
}

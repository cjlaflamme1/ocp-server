import { Injectable, Logger } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}
  private readonly logger = new Logger(S3Service.name);

  s3Configuration: S3ClientConfig = {
    credentials: {
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
    },
    region: 'us-east-2',
  };
  s3Client = new S3(this.s3Configuration);

  putImageObjectSignedUrl = async (
    imageFileName: string,
    imageFileType: string,
    imageDirectory: string,
  ) => {
    try {
      this.logger.log(imageDirectory);
      const imageBucketParams = {
        Bucket: 'outdoor-community-project',
        Key: `${imageDirectory}/${imageFileName}`,
        ContentType: `${imageFileType}`,
      };
      const command = new PutObjectCommand(imageBucketParams);
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 400,
      }).catch((e) => this.logger.log(e));
      return signedUrl;
    } catch (e) {
      this.logger.log(e);
      return e;
    }
  };

  getImageObjectSignedUrl = async (imageFileName: string) => {
    try {
      const imageBucketParams = {
        Bucket: 'outdoor-community-project',
        Key: `${imageFileName}`,
      };
      const command = new GetObjectCommand(imageBucketParams);
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 604800,
      }).catch((e) => this.logger.log(e));
      return signedUrl;
    } catch (e) {
      return e;
    }
  };
}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { LosenordModule } from './losenord/losenord.module';
import { S3Service } from './services/s3/s3.service';
import { ActivityTypesModule } from './activity-types/activity-types.module';
import { UsersActivityModule } from './users-activity/users-activity.module';
import { GroupModule } from './group/group.module';
import { GroupInvitationModule } from './group-invitation/group-invitation.module';
import { DbQueryService } from './services/db-query/db-query.service';
import { GroupPostModule } from './group-post/group-post.module';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { ResponseModule } from './response/response.module';
import { GroupEventModule } from './group-event/group-event.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailerService } from './services/mailer/mailer.service';
import { ResetRequestModule } from './reset-request/reset-request.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    RefreshTokenModule,
    LosenordModule,
    ActivityTypesModule,
    UsersActivityModule,
    GroupModule,
    GroupInvitationModule,
    GroupPostModule,
    ResponseModule,
    GroupEventModule,
    NotificationsModule,
    ResetRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service, DbQueryService, PushNotificationService, MailerService],
})
export class AppModule {}

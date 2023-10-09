import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class MailerService {
  constructor(private configService: ConfigService) {}
  logger = new Logger(MailerService.name);
  private transporter = nodemailer.createTransport({
    secure: true,
    service: 'gmail',
    auth: {
      user: this.configService.get<string>('GOOGLE_APP_USERNAME'),
      pass: this.configService.get<string>('GOOGLE_APP_PASSWORD'),
    },
  });

  async resetPassword(userEmail: string, token: number) {
    const email = await this.transporter.sendMail({
      from: '"Red Beard Technologies" <noreply@redbeardtechnologies.com>',
      to: userEmail,
      subject: 'Outdoor Community Project: Reset',
      text: token.toString() + ' This token expires in 15 minutes.',
      html: `<p>${token}</p><p>This token expires in 15 minutes.</p>`,
    });
    return email;
  }

  requestDeletion(user: User) {
    try {
      this.transporter.sendMail({
        from: '"Red Beard Technologies" <noreply@redbeardtechnologies.com>',
        to: user.email,
        subject: 'Outdoor Community Project: Account Delete Request',
        text: 'You have requested a deletion of your account at Outdoor Community Project. If this was not you, please respond to this email within 24 hours to cancel the request. The deletion will be complete within 30 days and we will send an email upon completion.',
        html: `<p>You have requested a deletion of your account at Outdoor Community Project.</p><p>If this was not you, please respond to this email within 24 hours to cancel the request. The deletion will be complete within 30 days and we will send an email upon completion.</p>`,
      });
      this.transporter.sendMail({
        from: '"Red Beard Technologies" <noreply@redbeardtechnologies.com>',
        to: 'chad@redbeardtechnologies.com',
        subject: 'Outdoor Community Project: Account Delete Request',
        text: `Request to delete: ${user.email}, with id: ${
          user.id
        } on ${new Date().toLocaleDateString()}.${JSON.stringify(user)}`,
        html: `<p>Request to delete: ${user.email}, with id: ${
          user.id
        } on ${new Date().toLocaleDateString()}.</p><p>${JSON.stringify(
          user,
        )}</p>`,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}

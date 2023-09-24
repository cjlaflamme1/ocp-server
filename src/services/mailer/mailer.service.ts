import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
  constructor(private configService: ConfigService) {}

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
}

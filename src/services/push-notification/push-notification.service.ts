import { Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PushNotificationService {
  constructor(private userService: UserService) {}
  expo = new Expo();

  async sendNotifications(
    userIds: string[],
    notificationData: Partial<ExpoPushMessage>,
  ) {
    const users = await this.userService.findSeveralUsers(userIds);
    if (users && users.length > 0) {
      const receiptRes = await this.expo.sendPushNotificationsAsync(
        users
          .filter(
            (user) =>
              user.expoPushToken && Expo.isExpoPushToken(user.expoPushToken),
          )
          .map((user) => ({
            to: user.expoPushToken,
            title: notificationData.title,
            body: notificationData.body,
            sound: 'default',
          })),
      );
      // TODO check receipts after 15 minutes. Check for errors
      return receiptRes;
    }
    return users;
  }
}

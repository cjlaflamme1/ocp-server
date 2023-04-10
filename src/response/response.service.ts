import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupPostService } from 'src/group-post/group-post.service';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { IncomingCreateResDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { Response } from './entities/response.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    private userService: UserService,
    private groupPostService: GroupPostService,
    private pushNotificationService: PushNotificationService,
  ) {}
  async create(createResponseDto: IncomingCreateResDto, authorEmail: string) {
    const userIds: string[] = [];
    const author = await this.userService.findOneByEmail(authorEmail);
    const groupPost = await this.groupPostService.findOne(
      createResponseDto.groupPostId,
      {
        author: true,
        responses: {
          author: true,
        },
        group: true,
      },
    );
    if (groupPost.author) {
      userIds.push(groupPost.author.id);
    }
    if (groupPost.responses && groupPost.responses.length > 0) {
      groupPost.responses.map((response) => {
        if (response.author) {
          userIds.push(response.author.id);
        }
      });
    }
    this.pushNotificationService.sendNotifications([...new Set(userIds)], {
      title: `New Response`,
      body: `There is a new response from ${author.firstName} in a thread you're involved in. Visit: ${groupPost.group.title} to view`,
    });
    return this.responseRepository.save({
      responseText: createResponseDto.responseText,
      author,
      groupPost,
    });
  }

  // findAll() {
  //   return `This action returns all response`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} response`;
  // }

  // update(id: number, updateResponseDto: UpdateResponseDto) {
  //   return `This action updates a #${id} response`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} response`;
  // }
}

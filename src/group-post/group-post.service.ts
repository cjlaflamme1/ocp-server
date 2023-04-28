import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupService } from 'src/group/group.service';
import { returnRelationsObject } from 'src/helpers/relationArrayToObject';
import {
  DbQueryService,
  QueryDetails,
} from 'src/services/db-query/db-query.service';
import { PushNotificationService } from 'src/services/push-notification/push-notification.service';
import { S3Service } from 'src/services/s3/s3.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateGroupPostDto } from './dto/create-group-post.dto';
import { UpdateGroupPostDto } from './dto/update-group-post.dto';
import { GroupPost } from './entities/group-post.entity';

@Injectable()
export class GroupPostService {
  constructor(
    @InjectRepository(GroupPost)
    private groupPostRepository: Repository<GroupPost>,
    private userService: UserService,
    private groupService: GroupService,
    private s3Service: S3Service,
    private dbQueryService: DbQueryService,
    private pushNotificationService: PushNotificationService,
  ) {}
  async create(createGroupPostDto: CreateGroupPostDto, authorEmail: string) {
    const author = await this.userService.findOneByEmail(authorEmail);
    const group = await this.groupService.findOne(createGroupPostDto.groupId, [
      'users',
    ]);
    if (group.users && group.users.length > 0) {
      const userIds: string[] = [];
      group.users.map((user) => userIds.push(user.id));
      this.pushNotificationService.sendNotifications([...new Set(userIds)], {
        title: 'New Group Post',
        body: `There is a new post in group ${group.title}, from ${author.firstName}.`,
      });
    }
    const post = await this.groupPostRepository.save({
      author,
      group,
      ...createGroupPostDto,
    });
    return post;
  }

  async findAll(queryFormatted: QueryDetails, relations: string[] = []) {
    const query = this.dbQueryService.queryBuilder(queryFormatted);
    const groupPosts = await this.groupPostRepository.findAndCount({
      ...query,
      relations: returnRelationsObject(relations),
      select: {
        id: true,
        image: true,
        postText: true,
        createdAt: true,
        author: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
        responses: {
          id: true,
        },
      },
    });
    if (groupPosts && groupPosts[1] > 0) {
      const formattedPosts = await Promise.all(
        groupPosts[0].map(async (post) => {
          let imageGetUrl = '';
          if (post.image) {
            imageGetUrl = await this.s3Service.getImageObjectSignedUrl(
              post.image,
            );
          }
          let authorImageUrl = '';
          if (post.author && post.author.profilePhoto) {
            authorImageUrl = await this.s3Service.getImageObjectSignedUrl(
              post.author.profilePhoto,
            );
          }
          return { ...post, imageGetUrl, authorImageUrl };
        }),
      );
      return {
        groupPosts: formattedPosts,
        count: groupPosts[1],
      };
    }
    return {
      groupPosts: groupPosts[0],
      count: groupPosts[1],
    };
  }

  async findOne(id: string, relations: object = {}) {
    const post = await this.groupPostRepository.findOne({
      where: {
        id,
      },
      relations,
    });
    if (post) {
      let imageGetUrl = '';
      if (post.image) {
        imageGetUrl = await this.s3Service.getImageObjectSignedUrl(post.image);
      }
      let authorImageUrl = '';
      if (post.author && post.author.profilePhoto) {
        authorImageUrl = await this.s3Service.getImageObjectSignedUrl(
          post.author.profilePhoto,
        );
      }
      return { ...post, imageGetUrl, authorImageUrl };
    }
    throw new HttpException('No post found', HttpStatus.NOT_FOUND);
  }

  // update(id: number, updateGroupPostDto: UpdateGroupPostDto) {
  //   return `This action updates a #${id} groupPost`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} groupPost`;
  // }
}

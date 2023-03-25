import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupService } from 'src/group/group.service';
import { returnRelationsObject } from 'src/helpers/relationArrayToObject';
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
  ) {}
  async create(createGroupPostDto: CreateGroupPostDto, authorEmail: string) {
    const author = await this.userService.findOneByEmail(authorEmail);
    const group = await this.groupService.findOne(createGroupPostDto.groupId);
    const post = await this.groupPostRepository.save({
      author,
      group,
      ...createGroupPostDto,
    });
    return post;
  }

  async findAll(groupId: string, relations: string[] = []) {
    const groupPosts = await this.groupPostRepository.findAndCount({
      where: {
        group: {
          id: groupId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: returnRelationsObject(relations),
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

  findOne(id: number) {
    return `This action returns a #${id} groupPost`;
  }

  update(id: number, updateGroupPostDto: UpdateGroupPostDto) {
    return `This action updates a #${id} groupPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupPost`;
  }
}

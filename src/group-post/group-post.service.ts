import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupService } from 'src/group/group.service';
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

  findAll() {
    return `This action returns all groupPost`;
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

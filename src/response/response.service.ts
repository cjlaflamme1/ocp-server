import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupPostService } from 'src/group-post/group-post.service';
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
  ) {}
  async create(createResponseDto: IncomingCreateResDto, authorEmail: string) {
    return this.responseRepository.save({
      responseText: createResponseDto.responseText,
      author: await this.userService.findOneByEmail(authorEmail),
      groupPost: await this.groupPostService.findOne(
        createResponseDto.groupPostId,
      ),
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

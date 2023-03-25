import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Logger,
} from '@nestjs/common';
import { GroupPostService } from './group-post.service';
import { CreateGroupPostDto } from './dto/create-group-post.dto';
import { UpdateGroupPostDto } from './dto/update-group-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('group-post')
@UseGuards(JwtAuthGuard)
export class GroupPostController {
  constructor(private readonly groupPostService: GroupPostService) {}
  logger = new Logger(GroupPostController.name);
  @Post()
  create(@Body() createGroupPostDto: CreateGroupPostDto, @Req() req) {
    return this.groupPostService.create(createGroupPostDto, req.user.email);
  }

  @Get()
  findAll(@Query('groupId') groupId: string) {
    this.logger.log('get groups posts');
    return this.groupPostService.findAll(groupId, ['author']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('get single post');
    // return this.groupPostService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateGroupPostDto: UpdateGroupPostDto,
  // ) {
  //   return this.groupPostService.update(+id, updateGroupPostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupPostService.remove(+id);
  // }
}

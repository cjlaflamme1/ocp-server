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
import { QueryDetails } from 'src/services/db-query/db-query.service';

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
  findAll(@Query() query) {
    const queryFormatted: QueryDetails = JSON.parse(query.dataSource);
    return this.groupPostService.findAll(queryFormatted, ['author']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupPostService.findOne(id, [
      'author',
      'responses',
      'responses.author',
    ]);
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

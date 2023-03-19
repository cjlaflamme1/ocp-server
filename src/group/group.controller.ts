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
import { GroupService } from './group.service';
import { CreateGroupDto, IncomingGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QueryDetails } from 'src/services/db-query/db-query.service';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  logger = new Logger(GroupController.name);
  @Post()
  create(@Body() createGroupDto: IncomingGroupDto, @Req() req) {
    return this.groupService.create(createGroupDto, req.user.email);
  }

  @Get()
  findAll(@Query() query, @Req() req) {
    const queryFormatted: QueryDetails = JSON.parse(query.dataSource);
    return this.groupService.findAll(queryFormatted, req.user.email, ['users']);
  }

  @Get('/current')
  findCurrent(@Query() query, @Req() req) {
    const queryFormatted: QueryDetails = JSON.parse(query.dataSource);
    return this.groupService.findUserGroups(req.user.email, queryFormatted, [
      'users',
      'groupAdmins',
    ]);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id, [
      'users',
      'groupAdmins',
      'pendingInvitations',
    ]);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}

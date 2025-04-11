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
import { IncomingGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QueryDetails } from 'src/services/db-query/db-query.service';
import { TestUserGuard } from 'src/auth/test-user.guard';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  logger = new Logger(GroupController.name);
  @Post()
  @UseGuards(TestUserGuard)
  create(@Body() createGroupDto: IncomingGroupDto, @Req() req) {
    return this.groupService.create(createGroupDto, req.user.email);
  }

  @Get()
  findAll(@Query() query) {
    this.logger.log(query);
    try {
      const decodedDataSource = decodeURI(query.dataSource);
      const queryFormatted: QueryDetails = JSON.parse(decodedDataSource);
      this.logger.log(queryFormatted);
      return this.groupService.findAll(queryFormatted, ['users']);
    } catch (error) {
      this.logger.error('Error parsing dataSource:', error);
      throw error;
    }
  }

  @Get('/current')
  findCurrent(@Query() query, @Req() req) {
    this.logger.log(query);
    try {
      const decodedDataSource = decodeURI(query.dataSource);
      const queryFormatted: QueryDetails = JSON.parse(decodedDataSource);
      this.logger.log(queryFormatted);
      return this.groupService.findUserGroups(req.user.email, queryFormatted, [
        'users',
        'groupAdmins',
      ]);
    } catch (error) {
      this.logger.error('Error parsing dataSource:', error);
      throw error;
    }
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

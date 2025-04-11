import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GroupEventService } from './group-event.service';
import { IncomingCreateGroupEventDto } from './dto/create-group-event.dto';
import { UpdateGroupEventDto } from './dto/update-group-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QueryDetails } from 'src/services/db-query/db-query.service';
import { TestUserGuard } from 'src/auth/test-user.guard';
import { Logger } from '@nestjs/common';

@Controller('group-event')
@UseGuards(JwtAuthGuard)
export class GroupEventController {
  private readonly logger = new Logger(GroupEventController.name);

  constructor(private readonly groupEventService: GroupEventService) {}

  @Post()
  @UseGuards(TestUserGuard)
  create(@Body() createGroupEventDto: IncomingCreateGroupEventDto, @Req() req) {
    createGroupEventDto.creatorEmail = req.user.email;
    return this.groupEventService.create(createGroupEventDto);
  }

  @Get()
  findAll(@Query() query) {
    this.logger.log(query);
    try {
      const decodedDataSource = decodeURI(query.dataSource);
      const queryFormatted: QueryDetails = JSON.parse(decodedDataSource);
      this.logger.log(queryFormatted);
      return this.groupEventService.findAll(queryFormatted, [
        'attendingUsers',
        'creator',
        'group',
        'responses',
      ]);
    } catch (error) {
      this.logger.error('Error parsing dataSource:', error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupEventService.findOne(id, {
      creator: true,
      attendingUsers: true,
      responses: {
        author: true,
      },
    });
  }

  @Patch(':id')
  @UseGuards(TestUserGuard)
  update(
    @Param('id') id: string,
    @Body() updateGroupEventDto: UpdateGroupEventDto,
  ) {
    return this.groupEventService.update(id, updateGroupEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupEventService.remove(+id);
  }
}

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

@Controller('group-event')
@UseGuards(JwtAuthGuard)
export class GroupEventController {
  constructor(private readonly groupEventService: GroupEventService) {}

  @Post()
  create(@Body() createGroupEventDto: IncomingCreateGroupEventDto, @Req() req) {
    createGroupEventDto.creatorEmail = req.user.email;
    return this.groupEventService.create(createGroupEventDto);
  }

  @Get()
  findAll(@Query() query) {
    const queryFormatted: QueryDetails = JSON.parse(query.dataSource);
    return this.groupEventService.findAll(queryFormatted, [
      'attendingUsers',
      'creator',
      'group',
    ]);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupEventService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupEventDto: UpdateGroupEventDto,
  ) {
    return this.groupEventService.update(+id, updateGroupEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupEventService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupEventService } from './group-event.service';
import { CreateGroupEventDto } from './dto/create-group-event.dto';
import { UpdateGroupEventDto } from './dto/update-group-event.dto';

@Controller('group-event')
export class GroupEventController {
  constructor(private readonly groupEventService: GroupEventService) {}

  @Post()
  create(@Body() createGroupEventDto: CreateGroupEventDto) {
    return this.groupEventService.create(createGroupEventDto);
  }

  @Get()
  findAll() {
    return this.groupEventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupEventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupEventDto: UpdateGroupEventDto) {
    return this.groupEventService.update(+id, updateGroupEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupEventService.remove(+id);
  }
}

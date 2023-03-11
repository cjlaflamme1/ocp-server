import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GroupInvitationService } from './group-invitation.service';
import { CreateGroupInvitationDto } from './dto/create-group-invitation.dto';
import { UpdateGroupInvitationDto } from './dto/update-group-invitation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('group-invitation')
@UseGuards(JwtAuthGuard)
export class GroupInvitationController {
  constructor(
    private readonly groupInvitationService: GroupInvitationService,
  ) {}

  @Post()
  create(@Body() createGroupInvitationDto: CreateGroupInvitationDto) {
    return this.groupInvitationService.create(createGroupInvitationDto);
  }

  @Get()
  findAll() {
    return this.groupInvitationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupInvitationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupInvitationDto: UpdateGroupInvitationDto,
  ) {
    return this.groupInvitationService.update(+id, updateGroupInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupInvitationService.remove(+id);
  }
}
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
} from '@nestjs/common';
import { GroupInvitationService } from './group-invitation.service';
import { CreateGroupInvitationDto, IncomingInviteExistingGroupDto } from './dto/create-group-invitation.dto';
import { UpdateGroupInvitationDto } from './dto/update-group-invitation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('group-invitation')
@UseGuards(JwtAuthGuard)
export class GroupInvitationController {
  constructor(
    private readonly groupInvitationService: GroupInvitationService,
  ) {}

  @Post()
  create(
    @Body() createGroupInvitationDto: IncomingInviteExistingGroupDto,
    @Req() req,
  ) {
    return this.groupInvitationService.create(
      createGroupInvitationDto,
      req.user.email,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.groupInvitationService.findAll(req.user.email, [
      'group',
      'invitedBy',
    ]);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupInvitationService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupInvitationDto: UpdateGroupInvitationDto,
  ) {
    return this.groupInvitationService.update(id, updateGroupInvitationDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupInvitationService.remove(+id);
  // }
}

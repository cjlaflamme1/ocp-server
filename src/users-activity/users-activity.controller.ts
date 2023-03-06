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
import { UsersActivityService } from './users-activity.service';
import { CreateUsersActivityDto } from './dto/create-users-activity.dto';
import { UpdateUsersActivityDto } from './dto/update-users-activity.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users-activity')
@UseGuards(JwtAuthGuard)
export class UsersActivityController {
  constructor(private readonly usersActivityService: UsersActivityService) {}

  @Post()
  create(@Body() createUsersActivityDto: CreateUsersActivityDto, @Req() req) {
    return this.usersActivityService.create(
      createUsersActivityDto,
      req.user.email,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.usersActivityService.findAllForUser(req.user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersActivityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersActivityDto: UpdateUsersActivityDto,
  ) {
    return this.usersActivityService.update(id, updateUsersActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersActivityService.remove(id);
  }
}

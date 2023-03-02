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
import { UsersActivityService } from './users-activity.service';
import { CreateUsersActivityDto } from './dto/create-users-activity.dto';
import { UpdateUsersActivityDto } from './dto/update-users-activity.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users-activity')
@UseGuards(JwtAuthGuard)
export class UsersActivityController {
  constructor(private readonly usersActivityService: UsersActivityService) {}

  @Post()
  create(@Body() createUsersActivityDto: CreateUsersActivityDto) {
    return this.usersActivityService.create(createUsersActivityDto);
  }

  @Get()
  findAll() {
    return this.usersActivityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersActivityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersActivityDto: UpdateUsersActivityDto,
  ) {
    return this.usersActivityService.update(+id, updateUsersActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersActivityService.remove(+id);
  }
}

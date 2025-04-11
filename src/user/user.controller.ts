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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QueryDetails } from 'src/services/db-query/db-query.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  logger = new Logger(UserController.name);

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query) {
    this.logger.log(query);
    try {
      const decodedDataSource = decodeURI(query.dataSource);
      const queryFormatted: QueryDetails = JSON.parse(decodedDataSource);
      this.logger.log(queryFormatted);
      return this.userService.findAll(queryFormatted, [
        'groups',
        'adminForGroups',
      ]);
    } catch (error) {
      this.logger.error('Error parsing dataSource:', error);
      throw error;
    }
  }

  @Get('/current')
  findCurrent(@Req() req) {
    return this.userService.findByEmailWithImage(req.user.email, [
      'activities',
    ]);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.remove(id, req.user.email);
  }
}

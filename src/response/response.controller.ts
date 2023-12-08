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
import { ResponseService } from './response.service';
import { IncomingCreateResDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TestUserGuard } from 'src/auth/test-user.guard';

@Controller('response')
@UseGuards(JwtAuthGuard)
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  @UseGuards(TestUserGuard)
  create(@Body() createResponseDto: IncomingCreateResDto, @Req() req) {
    return this.responseService.create(createResponseDto, req.user.email);
  }

  // @Get()
  // findAll() {
  //   return this.responseService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.responseService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateResponseDto: UpdateResponseDto,
  // ) {
  //   return this.responseService.update(+id, updateResponseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.responseService.remove(+id);
  // }
}

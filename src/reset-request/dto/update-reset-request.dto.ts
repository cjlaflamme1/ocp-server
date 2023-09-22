import { PartialType } from '@nestjs/mapped-types';
import { CreateResetRequestDto } from './create-reset-request.dto';

export class UpdateResetRequestDto extends PartialType(CreateResetRequestDto) {}

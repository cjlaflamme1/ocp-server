import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupEventDto } from './create-group-event.dto';

export class UpdateGroupEventDto extends PartialType(CreateGroupEventDto) {}

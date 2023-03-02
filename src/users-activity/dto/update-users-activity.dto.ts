import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersActivityDto } from './create-users-activity.dto';

export class UpdateUsersActivityDto extends PartialType(CreateUsersActivityDto) {}

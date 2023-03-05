import { ActivityType } from 'src/activity-types/entities/activity-type.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateUsersActivityDto {
  information: string;
  favoriteLocations: string;
  yearsParticipating: string;
  preferredGroupDetails: string;
  seekingMentor: boolean;
  mentorNeedsDetails: string;
  offeringMentorship: boolean;
  provideMentorshipDetails: string;
  activityTypeId: string;
  coverPhoto: string;
  user: User;
  activityType: ActivityType;
}

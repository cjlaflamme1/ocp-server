import { User } from 'src/user/entities/user.entity';

export class CreateUsersActivityDto {
  activityName: string;
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
}

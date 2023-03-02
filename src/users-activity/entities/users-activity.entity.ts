import { ActivityType } from 'src/activity-types/entities/activity-type.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class UsersActivity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    type: 'mediumtext',
  })
  information: string;

  @Column({
    nullable: true,
    type: 'mediumtext',
  })
  favoriteLocations: string;

  @Column({
    nullable: true,
  })
  yearsParticipating: string;

  @Column({
    nullable: true,
    type: 'mediumtext',
  })
  preferredGroupDetails: string;

  @Column({
    default: false,
  })
  seekingMentor: boolean;

  @Column({
    nullable: true,
    type: 'mediumtext',
  })
  mentorNeedsDetails: string;

  @Column({
    default: false,
  })
  offeringMentorship: boolean;

  @Column({
    nullable: true,
    type: 'mediumtext',
  })
  provideMentorshipDetails: string;

  @ManyToOne(() => ActivityType, (activityType) => activityType.usersActivity, {
    eager: true,
  })
  activityType: ActivityType;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

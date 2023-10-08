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
  })
  activityName: string;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  information: string;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  favoriteLocations: string;

  @Column({
    nullable: true,
  })
  yearsParticipating: string;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  preferredGroupDetails: string;

  @Column({
    default: false,
  })
  seekingMentor: boolean;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  mentorNeedsDetails: string;

  @Column({
    default: false,
  })
  offeringMentorship: boolean;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  provideMentorshipDetails: string;

  @Column({
    nullable: true,
  })
  coverPhoto: string;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

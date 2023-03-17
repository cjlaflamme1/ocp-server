import { GroupInvitation } from 'src/group-invitation/entities/group-invitation.entity';
import { Group } from 'src/group/entities/group.entity';
import { Losenord } from 'src/losenord/entities/losenord.entity';
import { UsersActivity } from 'src/users-activity/entities/users-activity.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    nullable: true,
  })
  profilePhoto: string;

  @Column({
    nullable: true,
  })
  expoPushToken: string;

  @OneToMany(() => Losenord, (losenord) => losenord.user, {
    cascade: ['insert', 'soft-remove'],
  })
  losenord: Losenord[];

  @OneToMany(() => UsersActivity, (usersActivity) => usersActivity.user)
  activities: UsersActivity[];

  @ManyToMany(() => Group, (group) => group.groupAdmins)
  @JoinTable()
  adminForGroups: Group[];

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Group[];

  @OneToMany(
    () => GroupInvitation,
    (groupInvitation) => groupInvitation.invitedUser,
  )
  groupInvitations: GroupInvitation[];

  // group invitations one user to many invitations

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

import { GroupEvent } from 'src/group-event/entities/group-event.entity';
import { GroupInvitation } from 'src/group-invitation/entities/group-invitation.entity';
import { GroupPost } from 'src/group-post/entities/group-post.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  coverPhoto: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    type: 'longtext',
  })
  description: string;

  @ManyToMany(() => User, (user) => user.adminForGroups)
  groupAdmins: User[];

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @OneToMany(
    () => GroupInvitation,
    (groupInvitation) => groupInvitation.group,
    {
      cascade: ['insert'],
    },
  )
  pendingInvitations: GroupInvitation[];

  @OneToMany(() => GroupPost, (groupPost) => groupPost.group)
  posts: GroupPost[];

  @OneToMany(() => GroupEvent, (groupEvent) => groupEvent.group)
  events: GroupEvent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

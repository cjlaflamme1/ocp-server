import { GroupInvitation } from 'src/group-invitation/entities/group-invitation.entity';
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
    type: 'mediumtext',
  })
  description: string;

  @ManyToMany(() => User, (user) => user.adminForGroups)
  groupAdmins: User[];

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @OneToMany(() => GroupInvitation, (groupInvitation) => groupInvitation.group)
  pendingInvitations: GroupInvitation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
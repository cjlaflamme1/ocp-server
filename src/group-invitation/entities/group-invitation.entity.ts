import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class GroupInvitation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    default: null,
  })
  accepted: boolean;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  message: string;

  @Column({
    default: false,
  })
  viewed: boolean;

  @ManyToOne(() => User, (user) => user.groupInvitations)
  invitedUser: User;

  @ManyToOne(() => Group, (group) => group.pendingInvitations)
  group: Group;

  @ManyToOne(() => User)
  invitedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

import { Group } from 'src/group/entities/group.entity';
import { Response } from 'src/response/entities/response.entity';
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
export class GroupEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventDate: Date;

  @Column({
    nullable: true,
  })
  coverPhoto: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToOne(() => User)
  creator: User;

  @ManyToOne(() => Group, (group) => group.events)
  group: Group;

  @ManyToMany(() => User, (user) => user.groupEvents)
  attendingUsers: User[];

  @OneToMany(() => Response, (response) => response.groupEvent)
  responses: Response[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

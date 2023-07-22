import { GroupEvent } from 'src/group-event/entities/group-event.entity';
import { GroupPost } from 'src/group-post/entities/group-post.entity';
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
export class Response extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  responseText: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => GroupPost, (groupPost) => groupPost.responses)
  groupPost: GroupPost;

  @ManyToOne(() => GroupEvent, (groupEvent) => groupEvent.responses)
  groupEvent: GroupEvent;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

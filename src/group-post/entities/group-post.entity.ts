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
export class GroupPost extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  postText: string;

  @ManyToOne(() => Group, (group) => group.posts)
  group: Group;

  @ManyToOne(() => User, (user) => user.groupPostsAuthored)
  author: User;

  @OneToMany(() => Response, (response) => response.groupPost)
  responses: Response[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

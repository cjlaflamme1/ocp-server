import { Losenord } from 'src/losenord/entities/losenord.entity';
import { UsersActivity } from 'src/users-activity/entities/users-activity.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

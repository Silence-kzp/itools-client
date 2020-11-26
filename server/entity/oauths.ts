import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
} from 'typeorm';
import User from './users';

@Entity()
export default class OAuths {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.id,
  )
  user: User;

  @Column()
  oauth_id: string;

  @Column()
  oauth_type: string;

  @Column()
  unionid: string;

  @Column()
  credential: string;
}

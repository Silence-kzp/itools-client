import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';

import OAuths from './oauths';

@Entity()
export default class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  username: string;

  @Column()
  password: string;

  @Column('datetime')
  created_at: Date;

  @Column('datetime')
  updated_at: Date;

  @OneToMany(
    () => OAuths,
    oauths => oauths.user,
  )
  oauths: OAuths[];
}

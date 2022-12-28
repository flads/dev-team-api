import { BaseEntity } from '../../common/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('levels')
export class Level extends BaseEntity {
  @Column('varchar')
  name: string;

  @OneToMany(() => User, (user) => user.level)
  users: User[];
}

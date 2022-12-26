import { BaseEntity } from '../../common/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;
}

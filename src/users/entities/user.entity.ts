import { BaseEntity } from '../../common/base.entity';
import { Entity, Column, AfterLoad } from 'typeorm';
import * as moment from 'moment';

@Entity('users')
export class User extends BaseEntity {
  protected age: number;

  @Column('varchar')
  name: string;

  @Column('int')
  level_id: number;

  @Column('varchar')
  gender: string;

  @Column('timestamp')
  birthdate: string;

  @Column('varchar')
  hobby: string;

  @AfterLoad()
  calculateAge() {
    this.age = moment().diff(this.birthdate, 'years');
  }
}

import { BaseEntity } from '../../common/base.entity';
import { Entity, Column, AfterLoad, ManyToOne, JoinColumn } from 'typeorm';
import * as moment from 'moment';
import { Level } from '../../levels/entities/level.entity';
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

  @ManyToOne(() => Level, (level) => level.users)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @AfterLoad()
  calculateAge() {
    this.age = moment().diff(this.birthdate, 'years');
  }

  @AfterLoad()
  parseBirthdate() {
    this.birthdate = moment(this.birthdate).format('DD/MM/YYYY');
  }
}

import { BaseEntity } from '../../common/base.entity';
import { Entity, Column, AfterLoad, ManyToOne, JoinColumn } from 'typeorm';
import * as moment from 'moment';
import { Level } from '../../levels/entities/level.entity';
@Entity('developers')
export class Developer extends BaseEntity {
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

  @ManyToOne(() => Level, (level) => level.developers)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @AfterLoad()
  calculateAge() {
    this.age = this.birthdate ? moment().diff(this.birthdate, 'years') : null;
  }

  @AfterLoad()
  parseBirthdate() {
    this.birthdate = this.birthdate
      ? moment(this.birthdate).format('DD/MM/YYYY')
      : null;
  }
}

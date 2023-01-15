import { BaseEntity } from '../../common/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Developer } from '../../developers/entities/developer.entity';

@Entity('levels')
export class Level extends BaseEntity {
  @Column('varchar')
  name: string;

  @OneToMany(() => Developer, (developer) => developer.level)
  developers: Developer[];
}

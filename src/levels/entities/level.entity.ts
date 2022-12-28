import { BaseEntity } from '../../common/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('levels')
export class Level extends BaseEntity {
  @Column('varchar')
  name: string;
}

import { DataSource, EntityTarget, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LiteralObject } from './interfaces/generic-object';
import * as moment from 'moment';

@Injectable()
export class BaseRepository<T> {
  protected repository;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  async create(entity: LiteralObject): Promise<T> {
    const now = moment().toDate();

    entity.created_at = now;
    entity.updated_at = now;

    return await this.repository.save(entity);
  }

  async update(
    criteria: string | number | LiteralObject,
    entity: LiteralObject,
  ): Promise<UpdateResult> {
    entity.updated_at = moment().toDate();

    return await this.repository.update(criteria, entity);
  }
}

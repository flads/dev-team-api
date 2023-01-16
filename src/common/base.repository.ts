import {
  DataSource,
  DeleteResult,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from './interfaces/generics.interface';
import * as moment from 'moment';

@Injectable()
export class BaseRepository<Entity extends ObjectLiteral> {
  protected repository: Repository<Entity>;

  constructor(entity: EntityTarget<Entity>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  async findOne(options: FindOneOptions<Entity>): Promise<Entity> {
    return await this.repository.findOne(options);
  }

  async create(entity: ObjectLiteral): Promise<Entity> {
    const now = moment().toDate();

    entity.created_at = now;
    entity.updated_at = now;

    return await this.repository.save(entity as Entity);
  }

  async update(
    criteria: FindOptionsWhere<Entity>,
    entity: ObjectLiteral,
  ): Promise<UpdateResult> {
    entity.updated_at = moment().toDate();

    return await this.repository.update(criteria, entity as Entity);
  }

  async delete(criteria: FindOptionsWhere<Entity>): Promise<DeleteResult> {
    return await this.repository.delete(criteria);
  }
}

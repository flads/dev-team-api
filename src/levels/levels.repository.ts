import {
  DataSource,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  Like,
} from 'typeorm';
import { BaseRepository } from '../common/base.repository';
import { FindAllQuery } from '../common/interfaces/parameters.interface';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { ObjectLiteral } from 'src/common/interfaces/generics.interface';
import { queryStringsToObject } from '../common/helpers/query.helper';

@Injectable()
export class LevelsRepository extends BaseRepository<Level> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Level, dataSource);
  }

  async findAll(query: FindAllQuery): Promise<ObjectLiteral> {
    const { sort, search } = query;

    const take = query.take || 10;
    const skip = query.skip || 0;

    const queryBuilder = this.repository
      .createQueryBuilder('levels')
      .loadRelationCountAndMap('levels.users_count', 'levels.users', 'user')
      .take(take)
      .skip(skip);

    if (sort) {
      queryBuilder.orderBy(queryStringsToObject(sort));
    }

    if (search) {
      queryBuilder.where({ name: Like('%' + search + '%') });
    }

    const [levels, count] = await queryBuilder.getManyAndCount();

    return { levels, count };
  }

  async findOne(options: FindOneOptions<Level>): Promise<Level> {
    return await super.findOne(options);
  }

  async create(level: Level) {
    return await super.create(level);
  }

  async update(criteria: FindOptionsWhere<Level>, level: Level) {
    return await super.update(criteria, level);
  }

  async delete(criteria: FindOptionsWhere<Level>): Promise<DeleteResult> {
    return await super.delete(criteria);
  }
}

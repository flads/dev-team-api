import {
  DataSource,
  DeleteResult,
  FindManyOptions,
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
    const { sort, search, take, skip } = query;

    const options: FindManyOptions = { take, skip };

    if (sort) {
      options.order = queryStringsToObject(sort);
    }

    if (search) {
      options.where = { name: Like('%' + search + '%') };
    }

    const [levels, count] = await super.findAndCount(options);

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

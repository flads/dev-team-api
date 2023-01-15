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
import { ObjectLiteral } from 'src/common/interfaces/generics.interface';
import { queryStringsToObject } from '../common/helpers/query.helper';
import { Developer } from './entities/developer.entity';

@Injectable()
export class DevelopersRepository extends BaseRepository<Developer> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Developer, dataSource);
  }

  async findAll(query: FindAllQuery): Promise<ObjectLiteral> {
    const options: FindManyOptions = { take: query.take, skip: query.skip };

    if (query.sort) {
      options.order = queryStringsToObject(query.sort);
    }

    if (query.search) {
      const like = Like('%' + query.search + '%');

      options.where = [{ name: like }, { gender: like }, { hobby: like }];
    }

    const [developers, count] = await super.findAndCount(options);

    return { developers, count };
  }

  async findOne(options: FindOneOptions<Developer>) {
    return await super.findOne(options);
  }

  async create(developer: Developer) {
    return await super.create(developer);
  }

  async update(criteria: FindOptionsWhere<Developer>, developer: Developer) {
    return await super.update(criteria, developer);
  }

  async delete(criteria: FindOptionsWhere<Developer>): Promise<DeleteResult> {
    return await super.delete(criteria);
  }
}

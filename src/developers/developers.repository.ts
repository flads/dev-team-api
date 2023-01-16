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
import { ObjectLiteral } from 'src/common/interfaces/generics.interface';
import { queryStringsToObject } from '../common/helpers/query.helper';
import { Developer } from './entities/developer.entity';

@Injectable()
export class DevelopersRepository extends BaseRepository<Developer> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Developer, dataSource);
  }

  async findAll(query: FindAllQuery): Promise<ObjectLiteral> {
    const { sort, search } = query;

    const take = query.take || 10;
    const skip = query.skip || 0;

    const queryBuilder = this.repository
      .createQueryBuilder('developers')
      .leftJoinAndSelect('developers.level', 'level')
      .select([
        'developers.id',
        'developers.name',
        'developers.gender',
        'developers.birthdate',
        'developers.hobby',
        'level.name',
      ])
      .take(take)
      .skip(skip);

    if (sort) {
      queryBuilder.orderBy(queryStringsToObject(sort));
    }

    if (search) {
      const like = Like('%' + search + '%');

      queryBuilder
        .orWhere({ name: like })
        .orWhere({ gender: like })
        .orWhere({ hobby: like })
        .orWhere({ level: { name: like } });
    }

    const [developers, count] = await queryBuilder.getManyAndCount();

    return {
      developers: developers.map((developer: ObjectLiteral) => {
        developer.level = developer.level.name;
        return developer;
      }),
      count,
    };
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

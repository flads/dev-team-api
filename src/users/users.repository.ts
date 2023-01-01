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
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(User, dataSource);
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

    const [users, count] = await super.findAndCount(options);

    return { users, count };
  }

  async findOne(options: FindOneOptions<User>) {
    return await super.findOne(options);
  }

  async create(user: User) {
    return await super.create(user);
  }

  async update(criteria: FindOptionsWhere<User>, user: User) {
    return await super.update(criteria, user);
  }

  async delete(criteria: FindOptionsWhere<User>): Promise<DeleteResult> {
    return await super.delete(criteria);
  }
}

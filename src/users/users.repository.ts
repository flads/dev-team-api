import {
  DataSource,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Like,
} from 'typeorm';
import { BaseRepository } from '../common/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ObjectLiteral } from 'src/common/interfaces/generic-object';
import { queryStringsToObject } from 'src/common/helpers/query.helper';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(User, dataSource);
  }

  async findAll(query: ObjectLiteral): Promise<ObjectLiteral> {
    const { sort, search, take, skip } = query;

    const options: FindManyOptions = { take, skip };

    if (sort) {
      options.order = queryStringsToObject(sort);
    }

    if (search) {
      const like = Like('%' + search + '%');

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

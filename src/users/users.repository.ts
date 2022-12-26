import {
  DataSource,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from '../common/base.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(User, dataSource);
  }

  async findAll(options: FindManyOptions<User>): Promise<User[]> {
    return await super.find(options);
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
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

import {
  DataSource,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(User, dataSource);
  }

  async findAll(options: FindManyOptions): Promise<User[]> {
    return await this.repository.find(options);
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    return await this.repository.findOne(options);
  }

  async create(user: User) {
    return await super.create(user);
  }

  async update(id: number, user: User) {
    return await super.update({ id }, user);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }
}

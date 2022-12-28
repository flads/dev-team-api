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
import { Level } from './entities/level.entity';

@Injectable()
export class LevelsRepository extends BaseRepository<Level> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Level, dataSource);
  }

  async findAll(options: FindManyOptions<Level>): Promise<Level[]> {
    return await super.find(options);
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

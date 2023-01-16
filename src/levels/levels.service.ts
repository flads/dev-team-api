import { FindManyOptions, UpdateResult } from 'typeorm';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllQuery } from '../common/interfaces/parameters.interface';
import { Level } from './entities/level.entity';
import { LevelsRepository } from './levels.repository';

@Injectable()
export class LevelsService {
  constructor(private levelsRepository: LevelsRepository) {}

  async findAll(query: FindAllQuery) {
    return await this.levelsRepository.findAll(query);
  }

  async findAllForSelect() {
    return await this.levelsRepository.findAllForSelect({
      select: ['id', 'name'],
      order: { id: 'ASC' },
    });
  }

  async findOne(
    options: FindManyOptions<Level>,
  ): Promise<Level | NotFoundException> {
    const level = await this.levelsRepository.findOne(options);

    if (!level) {
      throw new NotFoundException('Nível não encontrado!');
    }

    return level;
  }

  async create(level: Level) {
    try {
      return await this.levelsRepository.create(level as Level);
    } catch (error) {
      throw new BadRequestException('Não foi possível criar o Nível!');
    }
  }

  async update(
    id: number,
    level: Level,
  ): Promise<UpdateResult | NotFoundException | BadRequestException> {
    try {
      const updateResult = await this.levelsRepository.update({ id }, level);

      if (updateResult.affected === 0) {
        throw new NotFoundException('Nível não encontrado!');
      }

      return updateResult;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }

      throw new BadRequestException('Não foi possível atualizar o Nível!');
    }
  }

  async delete(
    id: number,
  ): Promise<void | NotFoundException | BadRequestException> {
    try {
      const deletedResult = await this.levelsRepository.delete({ id });

      if (deletedResult.affected === 0) {
        throw new Error();
      }
    } catch (error) {
      throw new BadRequestException('Não foi possível excluir o Nível!');
    }
  }
}

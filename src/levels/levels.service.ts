import { DeleteResult, FindManyOptions, UpdateResult } from 'typeorm';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Level } from './entities/level.entity';
import { LevelsRepository } from './levels.repository';

@Injectable()
export class LevelsService {
  constructor(private levelsRepository: LevelsRepository) {}

  async findAll(options: FindManyOptions<Level>) {
    return await this.levelsRepository.findAll(options);
  }

  async findOne(options): Promise<Level | NotFoundException> {
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
    id,
  ): Promise<DeleteResult | NotFoundException | BadRequestException> {
    const deletedResult = await this.levelsRepository.delete({ id });

    if (deletedResult.affected === 0) {
      throw new NotFoundException('Nível não encontrado!');
    }

    return deletedResult;
  }
}
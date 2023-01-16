import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllQuery } from '../common/interfaces/parameters.interface';
import { FindManyOptions, UpdateResult } from 'typeorm';
import { Developer } from './entities/developer.entity';
import { DevelopersRepository } from './developers.repository';
import * as moment from 'moment';

@Injectable()
export class DevelopersService {
  constructor(private developersRepository: DevelopersRepository) {}

  async findAll(query: FindAllQuery) {
    return await this.developersRepository.findAll(query);
  }

  async findOne(
    options: FindManyOptions<Developer>,
  ): Promise<Developer | NotFoundException> {
    const developer = await this.developersRepository.findOne(options);

    if (!developer) {
      throw new NotFoundException('Desenvolvedor não encontrado!');
    }

    return developer;
  }

  async create(developer: Developer) {
    try {
      if (developer.birthdate) {
        developer.birthdate = moment(developer.birthdate, 'DD/MM/YYYY').format(
          'YYYY-MM-DD',
        );
      }

      return await this.developersRepository.create(developer as Developer);
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Não foi possível criar o desenvolvedor!');
    }
  }

  async update(
    id: number,
    developer: Developer,
  ): Promise<UpdateResult | NotFoundException | BadRequestException> {
    try {
      const updateResult = await this.developersRepository.update(
        { id },
        developer,
      );

      if (updateResult.affected === 0) {
        throw new NotFoundException('Desenvolvedor não encontrado!');
      }

      return updateResult;
    } catch (error) {
      console.log(error);

      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }

      throw new BadRequestException(
        'Não foi possível atualizar o desenvolvedor!',
      );
    }
  }

  async delete(
    id: number,
  ): Promise<void | NotFoundException | BadRequestException> {
    try {
      const deletedResult = await this.developersRepository.delete({ id });

      if (deletedResult.affected === 0) {
        throw new Error();
      }
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Não foi possível excluir o desenvolvedor!',
      );
    }
  }
}

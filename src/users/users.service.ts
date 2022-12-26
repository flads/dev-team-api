import { DeleteResult, UpdateResult } from 'typeorm';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findAll(options) {
    return await this.usersRepository.findAll(options);
  }

  async findOne(options): Promise<User | NotFoundException> {
    const user = await this.usersRepository.findOne(options);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return user;
  }

  async create(user: User) {
    try {
      return await this.usersRepository.create(user as User);
    } catch (error) {
      throw new BadRequestException('Não foi possível criar o usuário!');
    }
  }

  async update(
    id: number,
    user: User,
  ): Promise<UpdateResult | NotFoundException | BadRequestException> {
    try {
      const updateResult = await this.usersRepository.update({ id }, user);

      if (updateResult.affected === 0) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      return updateResult;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }

      throw new BadRequestException('Não foi possível atualizar o usuário!');
    }
  }

  async delete(
    id,
  ): Promise<DeleteResult | NotFoundException | BadRequestException> {
    const deletedResult = await this.usersRepository.delete({ id });

    if (deletedResult.affected === 0) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return deletedResult;
  }
}

import { DeleteResult, UpdateResult } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
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
    return await this.usersRepository.create(user as User);
  }

  async update(
    id: number,
    user: User,
  ): Promise<UpdateResult | NotFoundException> {
    const updateResult = await this.usersRepository.update(id, user);

    if (updateResult.affected === 0) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return updateResult;
  }

  async delete(id): Promise<DeleteResult | NotFoundException> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return await this.usersRepository.delete(user.id);
  }
}

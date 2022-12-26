import { BadRequestException, NotFoundException } from '@nestjs/common';
import { connectionSource } from '../../../ormconfig';
import { CreateDto } from '../dtos/create.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateDto } from '../dtos/update.dto';
import { User } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import * as moment from 'moment';

describe('Users', () => {
  let johnDoe: User;
  let janeDoe: User;
  let users: User[];
  let updatedResult: UpdateResult;
  let deletedResult: DeleteResult;

  let usersController: UsersController;

  const repositoryMock: Repository<User> = jest.requireMock('typeorm');

  const repository = {
    ...repositoryMock,
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const now = moment().toDate();

  beforeEach(() => {
    johnDoe = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      created_at: now,
      updated_at: now,
    };

    janeDoe = {
      id: 2,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      created_at: now,
      updated_at: now,
    };

    users = [johnDoe, janeDoe];

    updatedResult = {
      generatedMaps: [],
      raw: [],
      affected: 1,
    };

    deletedResult = {
      raw: [],
      affected: 1,
    };

    connectionSource.getRepository = jest
      .fn()
      .mockImplementation(() => repository);

    usersController = new UsersController(
      new UsersService(new UsersRepository(connectionSource)),
    );
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      repository.find.mockImplementation(() => users);

      expect(usersController.findAll()).resolves.toEqual(users);

      expect(repository.find).toBeCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      repository.findOne.mockImplementation(() => johnDoe);

      expect(usersController.findOne(1)).resolves.toEqual(johnDoe);

      expect(repository.findOne).toBeCalledWith({ where: { id: 1 } });
    });

    it('should not found user and throw a NotFoundException', async () => {
      repository.findOne.mockImplementation(() => null);

      expect(usersController.findOne(3)).rejects.toEqual(
        new NotFoundException('Usuário não encontrado!'),
      );

      expect(repository.findOne).toBeCalledWith({ where: { id: 3 } });
    });
  });

  describe('create', () => {
    it('should create an user', async () => {
      const input: CreateDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      repository.save.mockImplementation(() => johnDoe);

      expect(usersController.create(input)).resolves.toEqual(johnDoe);

      expect(repository.save).toBeCalledWith(input);
    });

    it('should not create an user and throw a BadRequestException', async () => {
      const input: CreateDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      repository.save.mockImplementation(() =>
        Promise.reject(new Error('Database Error!')),
      );

      expect(usersController.create(input)).rejects.toEqual(
        new BadRequestException('Não foi possível criar o usuário!'),
      );

      expect(repository.save).toBeCalledWith(input);
    });
  });

  describe('update', () => {
    it('should update an user', async () => {
      const input: UpdateDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      repository.update.mockImplementation(async () => updatedResult);

      expect(usersController.update(1, input)).resolves.toEqual(updatedResult);

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });

    it('should not update an user and throw a BadRequestException', async () => {
      const input: UpdateDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      repository.update.mockImplementation(() =>
        Promise.reject(new Error('Database Error!')),
      );

      expect(usersController.update(1, input)).rejects.toEqual(
        new BadRequestException('Não foi possível atualizar o usuário!'),
      );

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });

    it('should not found an user, not update and throw a NotFoundException', async () => {
      const input: UpdateDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      updatedResult.affected = 0;

      repository.update.mockImplementation(async () => updatedResult);

      expect(usersController.update(1, input)).rejects.toEqual(
        new NotFoundException('Usuário não encontrado!'),
      );

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });
  });

  describe('delete', () => {
    it('should delete an user', async () => {
      repository.delete.mockImplementation(async () => deletedResult);

      expect(usersController.delete(1)).resolves.toEqual(deletedResult);

      expect(repository.delete).toBeCalledWith({ id: 1 });
    });

    it('should not found an user, not delete and throw a NotFoundException', async () => {
      deletedResult.affected = 0;

      repository.delete.mockImplementation(async () => deletedResult);

      expect(usersController.delete(1)).rejects.toEqual(
        new NotFoundException('Usuário não encontrado!'),
      );

      expect(repository.delete).toBeCalledWith({ id: 1 });
    });
  });
});

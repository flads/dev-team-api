import { BadRequestException, NotFoundException } from '@nestjs/common';
import { connectionSource } from '../../../ormconfig';
import { CreateUserDto } from '../dtos/create.dto';
import { DeleteResult, FindOperator, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from '../dtos/update.dto';
import { User } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import * as moment from 'moment';
import * as queryHelper from '../../common/helpers/query.helper';

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
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const now = moment().toDate();

  jest.spyOn(queryHelper, 'queryStringsToObject');

  beforeEach(() => {
    jest.clearAllMocks();

    johnDoe = {
      id: 1,
      name: 'John Doe',
      level_id: 1,
      gender: 'male',
      birthdate: '2002-12-01 00:00:00',
      hobby: 'Teaching',
      created_at: now,
      updated_at: now,
    } as User;

    janeDoe = {
      id: 2,
      name: 'Jane Doe',
      level_id: 1,
      gender: 'female',
      birthdate: '2002-12-01 00:00:00',
      hobby: 'Teaching',
      created_at: now,
      updated_at: now,
    } as User;

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
    it('should return an array of users taking default quantity and not skipping', async () => {
      const expected = {
        users,
        count: 2,
      };

      repository.findAndCount.mockImplementation(() => [users, 2]);

      expect(usersController.findAll({ query: {} } as any)).resolves.toEqual(
        expected,
      );

      expect(queryHelper.queryStringsToObject).not.toBeCalled();
      expect(repository.findAndCount).toBeCalledWith({
        take: 10,
        skip: 0,
      });
    });

    it('should return an array of users searching by "John"', async () => {
      const expected = {
        users,
        count: 2,
      };

      const query = {
        search: 'John',
      };

      const findOperator = new FindOperator('like', '%John%');

      repository.findAndCount.mockImplementation(() => [users, 2]);

      expect(usersController.findAll({ query } as any)).resolves.toEqual(
        expected,
      );

      expect(queryHelper.queryStringsToObject).not.toBeCalled();
      expect(repository.findAndCount).toBeCalledWith({
        take: 10,
        skip: 0,
        where: [
          { name: findOperator },
          { gender: findOperator },
          { hobby: findOperator },
        ],
      });
    });

    it('should return an array of users sorting by id asc, taking four users and skipping two', async () => {
      const expected = {
        users,
        count: 2,
      };

      const query = {
        sort: 'id asc',
        take: 4,
        skip: 2,
      };

      repository.findAndCount.mockImplementation(() => [users, 2]);

      expect(usersController.findAll({ query } as any)).resolves.toEqual(
        expected,
      );

      expect(queryHelper.queryStringsToObject).toBeCalledWith('id asc');
      expect(repository.findAndCount).toBeCalledWith({
        order: { id: 'asc' },
        take: 4,
        skip: 2,
      });
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
      const input: CreateUserDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
      };

      repository.save.mockImplementation(() => johnDoe);

      expect(usersController.create(input)).resolves.toEqual(johnDoe);

      expect(repository.save).toBeCalledWith(input);
    });

    it('should not create an user and throw a BadRequestException', async () => {
      const input: CreateUserDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
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
      const input: UpdateUserDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
      };

      repository.update.mockImplementation(async () => updatedResult);

      expect(usersController.update(1, input)).resolves.toEqual(updatedResult);

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });

    it('should not update an user and throw a BadRequestException', async () => {
      const input: UpdateUserDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
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
      const input: UpdateUserDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
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

      expect(usersController.delete(1)).resolves.toEqual(undefined);

      expect(repository.delete).toBeCalledWith({ id: 1 });
    });

    it('should not found an user, not delete and throw a BadRequestException', async () => {
      deletedResult.affected = 0;

      repository.delete.mockImplementation(async () => deletedResult);

      expect(usersController.delete(1)).rejects.toEqual(
        new BadRequestException('Não foi possível excluir o Usuário!'),
      );

      expect(repository.delete).toBeCalledWith({ id: 1 });
    });
  });
});

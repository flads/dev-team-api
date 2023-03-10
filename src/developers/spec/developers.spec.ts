import { BadRequestException, NotFoundException } from '@nestjs/common';
import { connectionSource } from '../../../ormconfig';
import { CreateDeveloperDto } from '../dtos/create.dto';
import { DeleteResult, FindOperator, Repository, UpdateResult } from 'typeorm';
import { UpdateDeveloperDto } from '../dtos/update.dto';
import { Developer } from '../entities/developer.entity';
import { DevelopersController } from '../developers.controller';
import { DevelopersRepository } from '../developers.repository';
import { DevelopersService } from '../developers.service';
import * as moment from 'moment';
import * as queryHelper from '../../common/helpers/query.helper';

describe('Developers', () => {
  let johnDoe: Developer;
  let janeDoe: Developer;
  let developers: Developer[];
  let updatedResult: UpdateResult;
  let deletedResult: DeleteResult;

  let developersController: DevelopersController;

  const repositoryMock: Repository<Developer> = jest.requireMock('typeorm');

  const createQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const repository = {
    ...repositoryMock,
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => createQueryBuilder),
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
      level: {
        name: 'Júnior',
      },
    } as Developer;

    janeDoe = {
      id: 2,
      name: 'Jane Doe',
      level_id: 1,
      gender: 'female',
      birthdate: '2002-12-01 00:00:00',
      hobby: 'Teaching',
      created_at: now,
      updated_at: now,
      level: {
        name: 'Júnior',
      },
    } as Developer;

    developers = [johnDoe, janeDoe];

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

    developersController = new DevelopersController(
      new DevelopersService(new DevelopersRepository(connectionSource)),
    );
  });

  describe('findAll', () => {
    it('should return an array of developers taking default quantity and not skipping', async () => {
      const expected = {
        developers,
        count: 2,
      };

      createQueryBuilder.getManyAndCount.mockImplementation(() => [
        developers,
        2,
      ]);

      expect(
        developersController.findAll({ query: {} } as any),
      ).resolves.toEqual(expected);

      expect(queryHelper.queryStringsToObject).not.toBeCalled();
      expect(createQueryBuilder.take).toBeCalledWith(10);
      expect(createQueryBuilder.skip).toBeCalledWith(0);
      expect(createQueryBuilder.select).toBeCalledWith([
        'developers.id',
        'developers.name',
        'developers.gender',
        'developers.birthdate',
        'developers.hobby',
        'level.name',
      ]);
      expect(createQueryBuilder.getManyAndCount).toBeCalledWith();
    });

    it('should return an array of developers searching by "John"', async () => {
      const expected = {
        developers,
        count: 2,
      };

      const query = {
        search: 'John',
      };

      const findOperator = new FindOperator('like', '%John%');

      createQueryBuilder.getManyAndCount.mockImplementation(() => [
        developers,
        2,
      ]);

      expect(developersController.findAll({ query } as any)).resolves.toEqual(
        expected,
      );

      expect(queryHelper.queryStringsToObject).not.toBeCalled();
      expect(createQueryBuilder.take).toBeCalledWith(10);
      expect(createQueryBuilder.skip).toBeCalledWith(0);
      expect(createQueryBuilder.orWhere).toBeCalledTimes(4);
      expect(createQueryBuilder.orWhere).toHaveBeenNthCalledWith(1, {
        name: findOperator,
      });
      expect(createQueryBuilder.orWhere).toHaveBeenNthCalledWith(2, {
        gender: findOperator,
      });
      expect(createQueryBuilder.orWhere).toHaveBeenNthCalledWith(3, {
        hobby: findOperator,
      });
      expect(createQueryBuilder.orWhere).toHaveBeenNthCalledWith(4, {
        level: { name: findOperator },
      });
      expect(createQueryBuilder.select).toBeCalledWith([
        'developers.id',
        'developers.name',
        'developers.gender',
        'developers.birthdate',
        'developers.hobby',
        'level.name',
      ]);
      expect(createQueryBuilder.getManyAndCount).toBeCalled();
    });

    it('should return an array of developers sorting by id asc, taking four developers and skipping two', async () => {
      const expected = {
        developers,
        count: 2,
      };

      const query = {
        sort: 'developers.id asc',
        take: 4,
        skip: 2,
      };

      createQueryBuilder.getManyAndCount.mockImplementation(() => [
        developers,
        2,
      ]);

      expect(developersController.findAll({ query } as any)).resolves.toEqual(
        expected,
      );

      expect(queryHelper.queryStringsToObject).toBeCalledWith(
        'developers.id asc',
      );
      expect(createQueryBuilder.take).toBeCalledWith(4);
      expect(createQueryBuilder.skip).toBeCalledWith(2);
      expect(createQueryBuilder.orderBy).toBeCalledWith({
        'developers.id': 'asc',
      });
      expect(createQueryBuilder.select).toBeCalledWith([
        'developers.id',
        'developers.name',
        'developers.gender',
        'developers.birthdate',
        'developers.hobby',
        'level.name',
      ]);
      expect(createQueryBuilder.getManyAndCount).toBeCalled();
    });

    it('should throw a BadRequestException', async () => {
      const query = { sort: 'id asc' };

      createQueryBuilder.getManyAndCount.mockImplementation(() =>
        Promise.reject(new BadRequestException('Database Error!')),
      );

      expect(developersController.findAll({ query } as any)).rejects.toEqual(
        new BadRequestException('Não foi possível listar os desenvolvedores!'),
      );

      expect(queryHelper.queryStringsToObject).toBeCalledWith('id asc');
      expect(createQueryBuilder.take).toBeCalledWith(10);
      expect(createQueryBuilder.skip).toBeCalledWith(0);
      expect(createQueryBuilder.orderBy).toBeCalledWith({
        id: 'asc',
      });
      expect(createQueryBuilder.select).toBeCalledWith([
        'developers.id',
        'developers.name',
        'developers.gender',
        'developers.birthdate',
        'developers.hobby',
        'level.name',
      ]);
      expect(createQueryBuilder.getManyAndCount).toBeCalled();
    });
  });

  describe('findOne', () => {
    it('should return an developer', async () => {
      repository.findOne.mockImplementation(() => johnDoe);

      expect(developersController.findOne(1)).resolves.toEqual(johnDoe);

      expect(repository.findOne).toBeCalledWith({ where: { id: 1 } });
    });

    it('should not found developer and throw a NotFoundException', async () => {
      repository.findOne.mockImplementation(() => null);

      expect(developersController.findOne(3)).rejects.toEqual(
        new NotFoundException('Desenvolvedor não encontrado!'),
      );

      expect(repository.findOne).toBeCalledWith({ where: { id: 3 } });
    });
  });

  describe('create', () => {
    it('should create an developer', async () => {
      const input: CreateDeveloperDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
      };

      repository.save.mockImplementation(() => johnDoe);

      expect(developersController.create(input)).resolves.toEqual(johnDoe);

      expect(repository.save).toBeCalledWith(input);
    });

    it('should not create an developer and throw a BadRequestException', async () => {
      const input: CreateDeveloperDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
      };

      repository.save.mockImplementation(() =>
        Promise.reject(new Error('Database Error!')),
      );

      expect(developersController.create(input)).rejects.toEqual(
        new BadRequestException('Não foi possível criar o desenvolvedor!'),
      );

      expect(repository.save).toBeCalledWith(input);
    });
  });

  describe('update', () => {
    it('should update an developer', async () => {
      const input: UpdateDeveloperDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
      };

      repository.update.mockImplementation(async () => updatedResult);

      expect(developersController.update(1, input)).resolves.toEqual(
        updatedResult,
      );

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });

    it('should not update an developer and throw a BadRequestException', async () => {
      const input: UpdateDeveloperDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
      };

      repository.update.mockImplementation(() =>
        Promise.reject(new Error('Database Error!')),
      );

      expect(developersController.update(1, input)).rejects.toEqual(
        new BadRequestException('Não foi possível atualizar o desenvolvedor!'),
      );

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });

    it('should not found an developer, not update and throw a NotFoundException', async () => {
      const input: UpdateDeveloperDto = {
        name: 'John Doe',
        level_id: 1,
        gender: 'male',
        birthdate: '2002-12-01 00:00:00',
        hobby: 'Teaching',
      };

      updatedResult.affected = 0;

      repository.update.mockImplementation(async () => updatedResult);

      expect(developersController.update(1, input)).rejects.toEqual(
        new NotFoundException('Desenvolvedor não encontrado!'),
      );

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });
  });

  describe('delete', () => {
    it('should delete an developer', async () => {
      repository.delete.mockImplementation(async () => deletedResult);

      expect(developersController.delete(1)).resolves.toEqual(undefined);

      expect(repository.delete).toBeCalledWith({ id: 1 });
    });

    it('should not found an developer, not delete and throw a BadRequestException', async () => {
      deletedResult.affected = 0;

      repository.delete.mockImplementation(async () => deletedResult);

      expect(developersController.delete(1)).rejects.toEqual(
        new BadRequestException('Não foi possível excluir o desenvolvedor!'),
      );

      expect(repository.delete).toBeCalledWith({ id: 1 });
    });
  });
});

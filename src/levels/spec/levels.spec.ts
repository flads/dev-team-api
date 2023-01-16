import { BadRequestException, NotFoundException } from '@nestjs/common';
import { connectionSource } from '../../../ormconfig';
import { CreateLevelDto } from '../dtos/create.dto';
import { DeleteResult, FindOperator, Repository, UpdateResult } from 'typeorm';
import { Level } from '../entities/level.entity';
import { LevelsController } from '../levels.controller';
import { LevelsRepository } from '../levels.repository';
import { LevelsService } from '../levels.service';
import { ObjectLiteral } from 'src/common/interfaces/generics.interface';
import { UpdateLevelDto } from '../dtos/update.dto';
import * as moment from 'moment';
import * as queryHelper from '../../common/helpers/query.helper';

describe('Levels', () => {
  let level: Level;
  let levelsList: Level[];
  let levelWithDevelopersCount: ObjectLiteral;
  let levelsWithDevelopersCount: ObjectLiteral;
  let updatedResult: UpdateResult;
  let deletedResult: DeleteResult;

  let levelsController: LevelsController;

  const repositoryMock: Repository<Level> = jest.requireMock('typeorm');

  const createQueryBuilder = {
    loadRelationCountAndMap: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const repository = {
    ...repositoryMock,
    find: jest.fn(),
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

    level = {
      id: 1,
      name: 'Júnior',
      created_at: now,
      updated_at: now,
    } as Level;

    levelsList = [
      { id: 1, name: 'Júnior' },
      { id: 2, name: 'Pleno' },
    ] as Level[];

    levelWithDevelopersCount = { ...level, developers_count: 2 };
    levelsWithDevelopersCount = [
      levelWithDevelopersCount,
      levelWithDevelopersCount,
    ];

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

    levelsController = new LevelsController(
      new LevelsService(new LevelsRepository(connectionSource)),
    );
  });

  describe('findAll', () => {
    it('should return an array of levels taking default quantity and not skipping', async () => {
      const expected = {
        levels: levelsWithDevelopersCount,
        count: 2,
      };

      createQueryBuilder.getManyAndCount.mockImplementation(() => [
        levelsWithDevelopersCount,
        2,
      ]);

      expect(levelsController.findAll({ query: {} } as any)).resolves.toEqual(
        expected,
      );

      expect(createQueryBuilder.loadRelationCountAndMap).toBeCalledWith(
        'levels.developers_count',
        'levels.developers',
        'developer',
      );
      expect(createQueryBuilder.take).toBeCalledWith(10);
      expect(createQueryBuilder.skip).toBeCalledWith(0);
      expect(createQueryBuilder.orderBy).not.toBeCalled();
      expect(queryHelper.queryStringsToObject).not.toBeCalled();
      expect(createQueryBuilder.where).not.toBeCalled();
      expect(createQueryBuilder.getManyAndCount).toBeCalledWith();
    });

    it('should return an array of levels searching by "Júnior"', async () => {
      const expected = {
        levels: levelsWithDevelopersCount,
        count: 2,
      };

      const query = {
        search: 'Júnior',
      };

      const findOperator = new FindOperator('like', '%Júnior%');

      createQueryBuilder.getManyAndCount.mockImplementation(() => [
        levelsWithDevelopersCount,
        2,
      ]);

      expect(levelsController.findAll({ query } as any)).resolves.toEqual(
        expected,
      );

      expect(createQueryBuilder.loadRelationCountAndMap).toBeCalledWith(
        'levels.developers_count',
        'levels.developers',
        'developer',
      );
      expect(createQueryBuilder.take).toBeCalledWith(10);
      expect(createQueryBuilder.skip).toBeCalledWith(0);
      expect(createQueryBuilder.where).toBeCalledWith({ name: findOperator });
      expect(createQueryBuilder.getManyAndCount).toBeCalledWith();

      expect(createQueryBuilder.orderBy).not.toBeCalled();
      expect(queryHelper.queryStringsToObject).not.toBeCalled();
    });

    it('should return an array of levels sorting by id asc, taking four levels and skipping two', async () => {
      const expected = {
        levels: levelsWithDevelopersCount,
        count: 2,
      };

      const query = {
        sort: 'id asc',
        take: 4,
        skip: 2,
      };

      createQueryBuilder.getManyAndCount.mockImplementation(() => [
        levelsWithDevelopersCount,
        2,
      ]);

      expect(levelsController.findAll({ query } as any)).resolves.toEqual(
        expected,
      );

      expect(createQueryBuilder.loadRelationCountAndMap).toBeCalledWith(
        'levels.developers_count',
        'levels.developers',
        'developer',
      );
      expect(createQueryBuilder.take).toBeCalledWith(4);
      expect(createQueryBuilder.skip).toBeCalledWith(2);
      expect(createQueryBuilder.orderBy).toBeCalledWith({ id: 'asc' });
      expect(queryHelper.queryStringsToObject).toBeCalledWith('id asc');
      expect(createQueryBuilder.getManyAndCount).toBeCalledWith();

      expect(createQueryBuilder.where).not.toBeCalled();
    });
  });

  describe('findAllForSelect', () => {
    it('should return levels for select', async () => {
      repository.find.mockImplementation(() => levelsList);

      expect(levelsController.findAllForSelect()).resolves.toEqual(levelsList);

      expect(repository.find).toBeCalledWith({
        select: ['id', 'name'],
        order: { id: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a level', async () => {
      repository.findOne.mockImplementation(() => level);

      expect(levelsController.findOne(1)).resolves.toEqual(level);

      expect(repository.findOne).toBeCalledWith({ where: { id: 1 } });
    });

    it('should not found level and throw a NotFoundException', async () => {
      repository.findOne.mockImplementation(() => null);

      expect(levelsController.findOne(3)).rejects.toEqual(
        new NotFoundException('Nível não encontrado!'),
      );

      expect(repository.findOne).toBeCalledWith({ where: { id: 3 } });
    });
  });

  describe('create', () => {
    it('should create a level', async () => {
      const input: CreateLevelDto = {
        name: 'Júnior',
      };

      repository.save.mockImplementation(() => level);

      expect(levelsController.create(input)).resolves.toEqual(level);

      expect(repository.save).toBeCalledWith(input);
    });

    it('should not create a level and throw a BadRequestException', async () => {
      const input: CreateLevelDto = {
        name: 'Júnior',
      };

      repository.save.mockImplementation(() =>
        Promise.reject(new Error('Database Error!')),
      );

      expect(levelsController.create(input)).rejects.toEqual(
        new BadRequestException('Não foi possível criar o Nível!'),
      );

      expect(repository.save).toBeCalledWith(input);
    });
  });

  describe('update', () => {
    it('should update a level', async () => {
      const input: UpdateLevelDto = {
        name: 'Júnior',
      };

      repository.update.mockImplementation(async () => updatedResult);

      expect(levelsController.update(1, input)).resolves.toEqual(updatedResult);

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });

    it('should not update a level and throw a BadRequestException', async () => {
      const input: UpdateLevelDto = {
        name: 'Júnior',
      };

      repository.update.mockImplementation(() =>
        Promise.reject(new Error('Database Error!')),
      );

      expect(levelsController.update(1, input)).rejects.toEqual(
        new BadRequestException('Não foi possível atualizar o Nível!'),
      );

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });

    it('should not found a level, not update and throw a NotFoundException', async () => {
      const input: UpdateLevelDto = {
        name: 'Júnior',
      };

      updatedResult.affected = 0;

      repository.update.mockImplementation(async () => updatedResult);

      expect(levelsController.update(1, input)).rejects.toEqual(
        new NotFoundException('Nível não encontrado!'),
      );

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });
  });

  describe('delete', () => {
    it('should delete a level', async () => {
      repository.delete.mockImplementation(async () => deletedResult);

      expect(levelsController.delete(1)).resolves.toEqual(undefined);

      expect(repository.delete).toBeCalledWith({ id: 1 });
    });

    it('should not found a level, not delete and throw a BadRequestException', async () => {
      deletedResult.affected = 0;

      repository.delete.mockImplementation(async () => deletedResult);

      expect(levelsController.delete(1)).rejects.toEqual(
        new BadRequestException('Não foi possível excluir o Nível!'),
      );

      expect(repository.delete).toBeCalledWith({ id: 1 });
    });
  });
});

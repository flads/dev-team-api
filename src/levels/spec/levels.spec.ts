import { BadRequestException, NotFoundException } from '@nestjs/common';
import { connectionSource } from '../../../ormconfig';
import { CreateDto } from '../dtos/create.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Level } from '../entities/level.entity';
import { LevelsController } from '../levels.controller';
import { LevelsRepository } from '../levels.repository';
import { LevelsService } from '../levels.service';
import { UpdateDto } from '../dtos/update.dto';
import * as moment from 'moment';

describe('Levels', () => {
  let level: Level;
  let levels: Level[];
  let updatedResult: UpdateResult;
  let deletedResult: DeleteResult;

  let levelsController: LevelsController;

  const repositoryMock: Repository<Level> = jest.requireMock('typeorm');

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
    level = {
      id: 1,
      name: 'Júnior',
      created_at: now,
      updated_at: now,
    } as Level;

    levels = [level, level];

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
    it('should return an array of levels', async () => {
      repository.find.mockImplementation(() => levels);

      expect(levelsController.findAll()).resolves.toEqual(levels);

      expect(repository.find).toBeCalledWith({});
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
      const input: CreateDto = {
        name: 'Júnior',
      };

      repository.save.mockImplementation(() => level);

      expect(levelsController.create(input)).resolves.toEqual(level);

      expect(repository.save).toBeCalledWith(input);
    });

    it('should not create a level and throw a BadRequestException', async () => {
      const input: CreateDto = {
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
      const input: UpdateDto = {
        name: 'Júnior',
      };

      repository.update.mockImplementation(async () => updatedResult);

      expect(levelsController.update(1, input)).resolves.toEqual(updatedResult);

      expect(repository.update).toBeCalledWith({ id: 1 }, input);
    });

    it('should not update a level and throw a BadRequestException', async () => {
      const input: UpdateDto = {
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
      const input: UpdateDto = {
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

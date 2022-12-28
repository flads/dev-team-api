import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { LevelsController } from './levels.controller';
import { LevelsRepository } from './levels.repository';
import { LevelsService } from './levels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  controllers: [LevelsController],
  providers: [LevelsService, LevelsRepository],
  exports: [LevelsService, LevelsRepository],
})
export class LevelsModule {}

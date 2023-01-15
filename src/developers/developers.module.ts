import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';
import { DevelopersController } from './developers.controller';
import { DevelopersRepository } from './developers.repository';
import { DevelopersService } from './developers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Developer])],
  controllers: [DevelopersController],
  providers: [DevelopersService, DevelopersRepository],
  exports: [DevelopersService, DevelopersRepository],
})
export class DevelopersModule {}

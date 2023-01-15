import { ConfigModule } from '@nestjs/config';
import { Configuration } from './config/configuration';
import { DataSource } from 'typeorm';
import { EnvironmentValidation } from './common/validations/environment.validation';
import { LevelsModule } from './levels/levels.module';
import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopersModule } from './developers/developers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration],
      validationSchema: EnvironmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    DevelopersModule,
    LevelsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

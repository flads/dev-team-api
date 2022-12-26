import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type'),
      port: this.configService.get('database.port'),
      host: this.configService.get('database.host'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
      entities: [__dirname + '/src/**/entities/*{.ts,.js}'],
      migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
      migrationsRun: true,
    } as TypeOrmModuleOptions;
  }
}

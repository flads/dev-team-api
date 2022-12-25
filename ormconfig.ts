import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectionSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/database/migrations/**/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
} as DataSourceOptions);

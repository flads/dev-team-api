import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const extension = process.env.NODE_ENV === 'production' ? '.js' : 'ts';

export const connectionSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  entities: [`src/models/**/*.${extension}`],
  migrations: [`src/migrations/*.${extension}`],
  synchronize: false,
  migrationsRun: true,
} as DataSourceOptions);

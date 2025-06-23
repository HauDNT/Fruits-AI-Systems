import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config({ path: '.env.development' });

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_table',
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

/*
File data-source.ts nên dùng .env thay vì ConfigService:
    + ConfigService là một provider của NestJS.
    + Nhưng file data-source.ts chỉ là file độc lập dùng để hỗ trợ CLI (như typeorm migration:generate, migration:run, ...).
    + Vì vậy nó không chạy trong Nest context, nên không có dependency injection.
*/

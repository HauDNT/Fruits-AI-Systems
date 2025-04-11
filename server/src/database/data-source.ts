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

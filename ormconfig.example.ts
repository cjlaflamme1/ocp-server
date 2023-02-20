import { DataSource } from 'typeorm';

const devDataSource = new DataSource({
  type: 'mysql',
  host: 'SECRET',
  port: 3306,
  username: 'SECRET',
  password: 'SECRET',
  database: 'SECRET',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
});

export default devDataSource;

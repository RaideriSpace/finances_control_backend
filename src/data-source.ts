import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * Config standalone usada apenas pela CLI do TypeORM (migration:generate/run).
 * A aplicação em si sobe a conexão via AppModule (TypeOrmModule.forRootAsync).
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
    },
  },
});

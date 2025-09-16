import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

// Import env config
let env: any;
try {
  env = require('./lib/config/env').env;
} catch (error) {
  // Fallback to process.env if env.ts fails
  env = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432'),
    DB_NAME: process.env.DB_NAME || 'myapp_db',
    DB_USER: process.env.DB_USER || 'myapp_user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'myapp_password',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}

export default defineConfig({
  driver: PostgreSqlDriver,
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  dbName: env.DB_NAME,
  entities: ['./lib/entities/**/*.ts'],
  entitiesTs: ['./lib/entities/**/*.ts'],
  migrations: {
    path: './lib/db/migrations',
    transactional: true,
    disableForeignKeys: false,
  },
  seeder: {
    path: './lib/db/seed',
    defaultSeeder: 'seed',
    glob: '!(*.d).{js,ts}',
  },
  debug: env.NODE_ENV === 'development',
  allowGlobalContext: env.NODE_ENV === 'development',
  forceEntityConstructor: true,
  // Connection pooling for production
  pool: {
    min: 2,
    max: 10,
  },
});

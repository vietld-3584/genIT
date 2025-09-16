require('reflect-metadata');
const { PostgreSqlDriver } = require('@mikro-orm/postgresql');
const { Migrator } = require('@mikro-orm/migrations');

/** @type {import('@mikro-orm/core').Options} */
module.exports = {
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'myapp_user',
  password: process.env.DB_PASSWORD || 'myapp_password',
  dbName: process.env.DB_NAME || 'myapp_db',
  // Sử dụng entitiesTs để load TypeScript entities trực tiếp
  entities: ['lib/entities/**/*.ts'],
  entitiesTs: ['lib/entities/**/*.ts'],
  migrations: {
    path: './lib/db/migrations',
    transactional: true,
    disableForeignKeys: false,
  },
  debug: (process.env.NODE_ENV || 'development') === 'development',
  allowGlobalContext: true,
  forceEntityConstructor: true,
  pool: {
    min: 2,
    max: 10,
  },
};

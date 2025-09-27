import { initializeORM, closeORM, getORM } from '../../../lib/db/client';
import { MikroORM } from '@mikro-orm/core';

let orm: MikroORM | null = null;

export const setupTestDatabase = async () => {
  orm = await initializeORM();
  // Ensure schema is up to date (safe for test only)
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
};

export const clearDatabase = async () => {
  if (!orm) return;
  const em = orm.em.fork();
  const conn = em.getConnection();
  // Truncate tables (except migrations if any). Order matters due to FK constraints.
  const tables = [
    'attachments',
    'messages',
    'channel_members',
    'channels',
    'login_logs',
    'email_confirmation_codes',
    'user_profiles',
    'user_logs',
    'comparisons',
    'wishlists',
    'reviews',
    'product_options',
    'product_images',
    'products',
    'brands',
    'categories',
    'user_accounts'
  ];
  for (const table of tables) {
    await conn.execute(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
  }
};

export const teardownTestDatabase = async () => {
  await closeORM();
  orm = null;
};

import 'reflect-metadata';
import { MikroORM, EntityManager, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { env } from '../config/env';
import { logger } from '../logging/logger';

// Import all entities explicitly for bundle optimization
import { UserAccount } from '../entities/user-account';
import { Category } from '../entities/category';
import { Brand } from '../entities/brand';
import { Product } from '../entities/product';
import { ProductImage } from '../entities/product-image';
import { ProductOption } from '../entities/product-option';
import { Review } from '../entities/review';
import { Wishlist } from '../entities/wishlist';
import { Comparison } from '../entities/comparison';
import { EmailConfirmationCode } from '../entities/email-confirmation-code';
import { Document } from '../entities/document';
import { LoginLog } from '../entities/login-log';
import { Channel } from '../entities/channel';
import { ChannelMember } from '../entities/channel-member';
import { Message } from '../entities/message';
import { Attachment } from '../entities/attachment';
import { UserLog } from '../entities/user-log';
import { UserProfile } from '../entities/user-profile';

let orm: MikroORM<PostgreSqlDriver> | null = null;

export const initializeORM = async (): Promise<MikroORM<PostgreSqlDriver>> => {
  if (orm) {
    return orm;
  }

  try {
    orm = await MikroORM.init<PostgreSqlDriver>({
      driver: PostgreSqlDriver,
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      dbName: env.DB_NAME,
      entities: [
        UserAccount,
        Category,
        Brand,
        Product,
        ProductImage,
        ProductOption,
        Review,
        Wishlist,
        Comparison,
        EmailConfirmationCode,
        Document,
        LoginLog,
        Channel,
        ChannelMember,
        Message,
        Attachment,
        UserLog,
        UserProfile,
      ],
      debug: env.NODE_ENV === 'development',
      allowGlobalContext: false,
      // @custom:start - Add custom ORM configuration here
      // @custom:end
    });

    logger.info('Database connection initialized successfully');
    return orm;
  } catch (error) {
    logger.error('Failed to initialize database connection:', error);
    throw error;
  }
};

export const getORM = async (): Promise<MikroORM<PostgreSqlDriver>> => {
  if (!orm) {
    return await initializeORM();
  }
  return orm;
};

export const getEM = (): EntityManager => {
  // Try to get EntityManager from RequestContext first
  try {
    const em = RequestContext.getEntityManager();
    if (em) {
      return em;
    }
  } catch {
    // RequestContext not available, fallback to global context
  }
  
  // Fallback to global context if RequestContext is not available
  if (!orm) {
    throw new Error('ORM not initialized. Call initializeORM() first.');
  }
  return orm.em;
};

export const closeORM = async (): Promise<void> => {
  if (orm) {
    await orm.close();
    orm = null;
    logger.info('Database connection closed');
  }
};

// Health check helper
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const ormInstance = await getORM();
    await ormInstance.em.getConnection().execute('SELECT 1');
    logger.info('Database health check passed');
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// @custom:start - Add custom database utilities here
// @custom:end

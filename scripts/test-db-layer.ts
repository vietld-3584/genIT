#!/usr/bin/env tsx

import 'reflect-metadata';
import { checkDatabaseConnection, initializeORM, closeORM } from '../lib/db/client';
import { logger } from '../lib/logging/logger';

async function testDatabaseLayer() {
  logger.info('🧪 Testing database layer...');

  try {
    // Test 1: Initialize ORM
    logger.info('1. Initializing ORM...');
    await initializeORM();
    logger.info('✅ ORM initialized successfully');

    // Test 2: Check database connection
    logger.info('2. Checking database connection...');
    const isHealthy = await checkDatabaseConnection();
    
    if (isHealthy) {
      logger.info('✅ Database connection is healthy');
    } else {
      logger.error('❌ Database connection failed');
      process.exit(1);
    }

    // Test 3: Test entity metadata (entities are discoverable)
    logger.info('3. Testing entity discovery...');
    const orm = await initializeORM();
    const metadataStorage = orm.getMetadata();
    const entities = metadataStorage.getAll();
    const entityNames = Object.keys(entities);
    
    logger.info(`✅ Found ${entityNames.length} entities:`);
    entityNames.forEach((name: string) => logger.info(`   - ${name}`));

    logger.info('🎉 All database layer tests passed!');

  } catch (error) {
    logger.error('❌ Database layer test failed:', error);
    process.exit(1);
  } finally {
    await closeORM();
  }
}

if (require.main === module) {
  testDatabaseLayer()
    .then(() => {
      logger.info('Database layer test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Database layer test failed:', error);
      process.exit(1);
    });
}

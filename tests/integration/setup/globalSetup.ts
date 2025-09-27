import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { initializeORM, closeORM, checkDatabaseConnection } from '../../../lib/db/client';
import { createTestApp, closeTestApp } from './server.js';
import { seedTestData, cleanupTestData } from './testData.js';
import { logger } from '../../../lib/logging/logger';

// Global test app instance
let testApp: any = null;

beforeAll(async () => {
  logger.info('🧪 Setting up integration tests...');

  try {
    // 1. Initialize database connection
    await initializeORM();
    logger.info('✅ Database initialized');

    // 2. Check database health
    const isHealthy = await checkDatabaseConnection();
    if (!isHealthy) {
      throw new Error('Database connection failed');
    }
    logger.info('✅ Database connection verified');

    // 3. Create test Express app
    testApp = await createTestApp();
    logger.info('✅ Test server created');

    // 4. Seed minimal test data
    await seedTestData();
    logger.info('✅ Test data seeded');

    logger.info('🎉 Integration test setup complete!');
  } catch (error) {
    logger.error('❌ Integration test setup failed:', error);
    throw error;
  }
}, 60000); // 60 second timeout

afterAll(async () => {
  logger.info('🧹 Tearing down integration tests...');
  
  try {
    // 1. Cleanup test data
    await cleanupTestData();
    logger.info('✅ Test data cleaned up');

    // 2. Close test server
    if (testApp) {
      await closeTestApp();
      logger.info('✅ Test server closed');
    }

    // 3. Close database connection
    await closeORM();
    logger.info('✅ Database connection closed');

    logger.info('🎉 Integration test teardown complete!');
  } catch (error) {
    logger.error('❌ Integration test teardown failed:', error);
  }
}, 30000); // 30 second timeout

beforeEach(() => {
  // Reset any per-test state if needed
  logger.info('🔄 Preparing for test...');
});

afterEach(() => {
  // Clean up any per-test state if needed
  logger.info('✨ Test completed');
});

// Export test app for use in tests
export { testApp };
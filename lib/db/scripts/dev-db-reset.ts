import { getORM, closeORM } from '../client';
import { logger } from '../../logging/logger';
import { env } from '../../config/env';
import { seedDatabase } from '../seed/seed';

/**
 * Development database reset script
 * WARNING: This will DROP and RECREATE the entire database schema!
 */
export const resetDevelopmentDatabase = async (): Promise<void> => {
  // Safety check - only allow in development
  if (env.NODE_ENV === 'production') {
    throw new Error('Database reset is not allowed in production environment!');
  }

  try {
    logger.info('🔄 Starting development database reset...');
    
    const orm = await getORM();
    const generator = orm.getSchemaGenerator();

    // Drop all tables
    logger.info('📝 Dropping existing schema...');
    await generator.dropSchema();

    // Create fresh schema from entities
    logger.info('🏗️ Creating fresh schema...');
    await generator.createSchema();

    // Run seeding
    logger.info('🌱 Seeding database...');
    await seedDatabase();

    logger.info('✅ Development database reset completed successfully!');
    
  } catch (error) {
    logger.error('❌ Development database reset failed:', error);
    throw error;
  } finally {
    await closeORM();
  }
};

// Main execution when called directly
if (require.main === module) {
  resetDevelopmentDatabase()
    .then(() => {
      logger.info('Dev reset script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Dev reset script failed:', error);
      process.exit(1);
    });
}

export default resetDevelopmentDatabase;

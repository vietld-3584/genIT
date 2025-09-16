import { getORM, getEM } from '../client';
import { UserAccount } from '../../entities/user-account';
import { Category } from '../../entities/category';
import { Brand } from '../../entities/brand';

export const seedDatabase = async (): Promise<void> => {
  let orm;
  try {
    console.log('Starting database seeding...');
    
    orm = await getORM();
    const em = getEM();

    // Check if data already exists (idempotent seeding)
    const userCount = await em.count(UserAccount);
    
    if (userCount > 0) {
      console.log('Database already contains data, skipping seed');
      return;
    }

    // Simple seed data
    console.log('Creating seed data...');

    // Create a test category (MikroORM will handle createdAt/updatedAt)
    const category = em.create(Category, {
      name: 'Electronics'
    });

    // Create a test brand
    const brand = em.create(Brand, {
      name: 'Samsung'
    });

    // Create a test user
    const user = em.create(UserAccount, {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789'
    });

    await em.persistAndFlush([category, brand, user]);
    
    console.log('Database seeding completed successfully');
    
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  } finally {
    if (orm) {
      await orm.close();
    }
  }
};

// Direct execution when script is run
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

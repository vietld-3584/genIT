import { getORM, getEM } from '../client';
import { UserAccount } from '../../entities/user-account';
import { Category } from '../../entities/category';
import { Brand } from '../../entities/brand';
import { Product } from '../../entities/product';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database seeding...');
    
    await getORM();
    const em = getEM();

    // Check if data already exists (idempotent seeding)
    const userCount = await em.count(UserAccount);
    const categoryCount = await em.count(Category);
    const brandCount = await em.count(Brand);

    if (userCount > 0 || categoryCount > 0 || brandCount > 0) {
      console.log('Database already contains data, skipping seed');
      return;
    }

    // @custom:start - Add custom seed data validation here
    // @custom:end

    // Seed Categories
    const categories = [
      { name: 'Electronics', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Clothing', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Home & Garden', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sports', createdAt: new Date(), updatedAt: new Date() },
    ];
    
    const savedCategories: Category[] = [];
    for (const categoryData of categories) {
      const category = em.create(Category, categoryData);
      savedCategories.push(category);
    }
    await em.persistAndFlush(savedCategories);
    console.log(`Seeded ${savedCategories.length} categories`);    // Seed Brands
    const brands = [
      { name: 'Apple' },
      { name: 'Samsung' },
      { name: 'Nike' },
      { name: 'Adidas' },
      { name: 'Sony' },
    ];

    const savedBrands: Brand[] = [];
    for (const brandData of brands) {
      const brand = em.create(Brand, brandData);
      savedBrands.push(brand);
    }
    await em.persistAndFlush(savedBrands);
    logger.info(`Seeded ${savedBrands.length} brands`);

    // Seed Sample User Accounts
    const users = [
      {
        name: 'Admin User',
        title: 'System Administrator',
        email: 'admin@example.com',
        passwordHash: '$2b$10$placeholder_hash_should_be_replaced', // Replace with real hash
      },
      {
        name: 'John Doe',
        title: 'Customer',
        email: 'john.doe@example.com',
        passwordHash: '$2b$10$placeholder_hash_should_be_replaced', // Replace with real hash
      },
    ];

    const savedUsers: UserAccount[] = [];
    for (const userData of users) {
      const user = em.create(UserAccount, userData);
      savedUsers.push(user);
    }
    await em.persistAndFlush(savedUsers);
    logger.info(`Seeded ${savedUsers.length} user accounts`);

    // Seed Sample Products
    const sampleProducts = [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced features',
        sku: 'IPHONE15PRO001',
        categoryId: savedCategories[0].id, // Electronics
        brandId: savedBrands[0].id, // Apple
        price: 1199.99,
        originalPrice: 1299.99,
        discountPercent: 8,
        availability: 'In Stock',
        rating: 4.5,
        reviewCount: 150,
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Flagship Android smartphone',
        sku: 'GALAXY24001',
        categoryId: savedCategories[0].id, // Electronics
        brandId: savedBrands[1].id, // Samsung
        price: 999.99,
        availability: 'In Stock',
        rating: 4.3,
        reviewCount: 98,
      },
    ];

    const savedProducts: Product[] = [];
    for (const productData of sampleProducts) {
      const product = em.create(Product, productData);
      savedProducts.push(product);
    }
    await em.persistAndFlush(savedProducts);
    logger.info(`Seeded ${savedProducts.length} products`);

    // @custom:start - Add additional seed data here
    // @custom:end

    logger.info('Database seeding completed successfully');
    } catch (error) {
    console.error('Failed to initialize database connection:', error);
    throw error;
  }
};

// Main execution when called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seed script failed:', error);
      process.exit(1);
    });
}

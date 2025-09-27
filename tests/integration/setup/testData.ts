import { faker } from '@faker-js/faker';
import { initializeORM } from '../../../lib/db/client';
import { logger } from '../../../lib/logging/logger';

// Test data references that will be populated during seeding
export const testData = {
  users: [] as Array<{
    id: string;
    email: string;
    name: string;
    password: string; // Plain text for testing
    title?: string;
  }>,
  channels: [] as Array<{
    id: string;
    name: string;
    description?: string;
    createdBy: string;
  }>,
  memberships: [] as Array<{
    channelId: string;
    userId: string;
  }>,
  messages: [] as Array<{
    id: string;
    channelId: string;
    senderId: string;
    content: string;
  }>
};

/**
 * Seeds minimal test data for integration tests
 */
export async function seedTestData(): Promise<void> {
  try {
    logger.info('🌱 Seeding test data...');
    
    // Reset test data
    testData.users = [];
    testData.channels = [];
    testData.memberships = [];
    testData.messages = [];

    const orm = await initializeORM();
    const em = orm.em.fork(); // Use a forked entity manager for seeding

    // Create test users
    const users = [
      {
        id: faker.string.uuid(),
        email: 'test.user1@example.com',
        name: 'Test User One',
        password: 'password123',
        title: 'Software Developer'
      },
      {
        id: faker.string.uuid(),
        email: 'test.user2@example.com',
        name: 'Test User Two',
        password: 'password456',
        title: 'Product Manager'
      },
      {
        id: faker.string.uuid(),
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123',
        title: 'System Administrator'
      },
      {
        id: faker.string.uuid(),
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'validPassword123',
        title: 'QA Engineer'
      }
    ];

    // Create test channels
    const channels = [
      {
        id: faker.string.uuid(),
        name: 'General',
        description: 'General discussion channel',
        createdBy: users[0].id
      },
      {
        id: faker.string.uuid(),
        name: 'Random',
        description: 'Random conversations',
        createdBy: users[1].id
      },
      {
        id: faker.string.uuid(),
        name: 'Tech',
        description: 'Technical discussions',
        createdBy: users[2].id
      }
    ];

    // Create memberships (users joined to channels)
    const memberships = [
      // User 1 is in all channels
      { channelId: channels[0].id, userId: users[0].id },
      { channelId: channels[1].id, userId: users[0].id },
      { channelId: channels[2].id, userId: users[0].id },
      // User 2 is in General and Random
      { channelId: channels[0].id, userId: users[1].id },
      { channelId: channels[1].id, userId: users[1].id },
      // Admin is in all channels
      { channelId: channels[0].id, userId: users[2].id },
      { channelId: channels[1].id, userId: users[2].id },
      { channelId: channels[2].id, userId: users[2].id },
      // John Doe is in General only
      { channelId: channels[0].id, userId: users[3].id }
    ];

    // Create some test messages
    const messages = [
      {
        id: faker.string.uuid(),
        channelId: channels[0].id,
        senderId: users[0].id,
        content: 'Hello everyone!'
      },
      {
        id: faker.string.uuid(),
        channelId: channels[0].id,
        senderId: users[1].id,
        content: 'Welcome to the general channel'
      },
      {
        id: faker.string.uuid(),
        channelId: channels[1].id,
        senderId: users[2].id,
        content: 'Random conversation starter'
      }
    ];

    // Store in testData for use in tests
    testData.users = users;
    testData.channels = channels;
    testData.memberships = memberships;
    testData.messages = messages;

    // TODO: Actually persist to database once entities and repositories are implemented
    // For now, we'll just log that data is prepared
    logger.info(`✅ Prepared ${users.length} test users`);
    logger.info(`✅ Prepared ${channels.length} test channels`);
    logger.info(`✅ Prepared ${memberships.length} test memberships`);
    logger.info(`✅ Prepared ${messages.length} test messages`);

    logger.info('🌱 Test data seeding completed');
  } catch (error) {
    logger.error('❌ Failed to seed test data:', error);
    throw error;
  }
}

/**
 * Cleans up test data after tests complete
 */
export async function cleanupTestData(): Promise<void> {
  try {
    logger.info('🧹 Cleaning up test data...');
    
    const orm = await initializeORM();
    const em = orm.em.fork();

    // TODO: Actually clean up database once entities are implemented
    // For now, just reset in-memory test data
    testData.users = [];
    testData.channels = [];
    testData.memberships = [];
    testData.messages = [];

    logger.info('✅ Test data cleanup completed');
  } catch (error) {
    logger.error('❌ Failed to cleanup test data:', error);
    throw error;
  }
}

/**
 * Get a specific test user by email
 */
export function getTestUserByEmail(email: string) {
  return testData.users.find(user => user.email === email);
}

/**
 * Get a specific test channel by name
 */
export function getTestChannelByName(name: string) {
  return testData.channels.find(channel => channel.name === name);
}

/**
 * Get test users that are members of a specific channel
 */
export function getChannelMembers(channelId: string) {
  const memberUserIds = testData.memberships
    .filter(membership => membership.channelId === channelId)
    .map(membership => membership.userId);
  
  return testData.users.filter(user => memberUserIds.includes(user.id));
}
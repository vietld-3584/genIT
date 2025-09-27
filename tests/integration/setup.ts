import 'reflect-metadata'
import { config } from 'dotenv'
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { MikroORM } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import mikroOrmConfig from '../../mikro-orm.config'
import { UserAccount } from '../../lib/entities/user-account'
import { Channel } from '../../lib/entities/channel'
import { ChannelMember } from '../../lib/entities/channel-member'
import { Message } from '../../lib/entities/message'

// Load test environment variables
config({ path: '.env.test' })

// Global test database instance
let orm: MikroORM<PostgreSqlDriver>

// Test data cleanup
export const cleanup = async () => {
  if (!orm) return
  
  const em = orm.em.fork()
  
  // Clean up in correct order to avoid foreign key constraints
  await em.nativeDelete(Message, {})
  await em.nativeDelete(ChannelMember, {})
  await em.nativeDelete(Channel, {})
  await em.nativeDelete(UserAccount, {})
  
  await em.flush()
}

// Setup database connection
beforeAll(async () => {
  try {
    // Override database name for testing
    const testConfig = {
      ...mikroOrmConfig,
      dbName: process.env.DB_NAME || 'myapp_test_db',
      debug: false,
      allowGlobalContext: true,
    }
    
    orm = await MikroORM.init<PostgreSqlDriver>(testConfig)
    
    // Ensure schema is up to date
    const generator = orm.getSchemaGenerator()
    await generator.refreshDatabase()
    
    console.log('✅ Test database connected and schema refreshed')
  } catch (error) {
    console.error('❌ Failed to setup test database:', error)
    throw error
  }
})

// Cleanup after each test
afterEach(async () => {
  await cleanup()
})

// Close database connection
afterAll(async () => {
  if (orm) {
    await cleanup()
    await orm.close(true)
    console.log('✅ Test database connection closed')
  }
})

// Export ORM instance for use in tests
export { orm }

// Test utilities
export const createTestUser = async (overrides: Partial<UserAccount> = {}) => {
  const em = orm.em.fork()
  
  const user = em.create(UserAccount, {
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: '$2b$10$testhashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })
  
  await em.persistAndFlush(user)
  return user
}

export const createTestChannel = async (overrides: Partial<Channel> = {}) => {
  const em = orm.em.fork()
  
  const channel = em.create(Channel, {
    channelName: 'test-channel',
    description: 'Test Channel Description',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })
  
  await em.persistAndFlush(channel)
  return channel
}

export const createChannelMember = async (channel: Channel, user: UserAccount, role: string = 'member') => {
  const em = orm.em.fork()
  
  const member = em.create(ChannelMember, {
    channel,
    userAccount: user,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  
  await em.persistAndFlush(member)
  return member
}

export const createTestMessage = async (channel: Channel, user: UserAccount, content: string = 'Test message') => {
  const em = orm.em.fork()
  
  const message = em.create(Message, {
    channel,
    userAccount: user,
    messageText: content,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  
  await em.persistAndFlush(message)
  return message
}
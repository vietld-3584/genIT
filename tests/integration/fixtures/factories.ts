import { faker } from '@faker-js/faker';

/**
 * Factory for creating test users with realistic data
 */
export class UserFactory {
  /**
   * Create a user with default random values
   */
  static create(overrides: Partial<UserData> = {}): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    return {
      id: faker.string.uuid(),
      email,
      name: `${firstName} ${lastName}`,
      password: faker.internet.password({ length: 10, memorable: false }),
      title: faker.person.jobTitle(),
      photoUrl: faker.image.avatar(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides
    };
  }

  /**
   * Create a user with a specific email format
   */
  static createWithEmail(email: string, overrides: Partial<UserData> = {}): UserData {
    const [username] = email.split('@');
    const name = username.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return this.create({
      email,
      name,
      ...overrides
    });
  }

  /**
   * Create an admin user
   */
  static createAdmin(overrides: Partial<UserData> = {}): UserData {
    return this.create({
      email: `admin+${faker.string.alphanumeric(5)}@example.com`,
      name: `Admin ${faker.person.lastName()}`,
      title: 'System Administrator',
      ...overrides
    });
  }

  /**
   * Create a regular user with basic info
   */
  static createRegular(overrides: Partial<UserData> = {}): UserData {
    return this.create({
      email: `user+${faker.string.alphanumeric(5)}@example.com`,
      title: faker.helpers.arrayElement([
        'Software Developer',
        'Product Manager', 
        'Designer',
        'QA Engineer',
        'DevOps Engineer'
      ]),
      ...overrides
    });
  }

  /**
   * Create multiple users
   */
  static createMany(count: number, overrides: Partial<UserData> = {}): UserData[] {
    return faker.helpers.multiple(() => this.create(overrides), { count });
  }
}

/**
 * Factory for creating test channels
 */
export class ChannelFactory {
  /**
   * Create a channel with default random values
   */
  static create(overrides: Partial<ChannelData> = {}): ChannelData {
    const adjective = faker.word.adjective();
    const noun = faker.word.noun();
    
    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        'general',
        'random',
        'tech',
        'design',
        'marketing',
        `${adjective}-${noun}`,
        faker.company.buzzNoun().toLowerCase()
      ]),
      description: faker.company.catchPhrase(),
      memberCount: faker.number.int({ min: 1, max: 100 }),
      createdBy: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides
    };
  }

  /**
   * Create a channel with specific name
   */
  static createWithName(name: string, overrides: Partial<ChannelData> = {}): ChannelData {
    return this.create({
      name,
      description: `Channel for ${name} discussions`,
      ...overrides
    });
  }

  /**
   * Create multiple channels
   */
  static createMany(count: number, overrides: Partial<ChannelData> = {}): ChannelData[] {
    return faker.helpers.multiple(() => this.create(overrides), { count });
  }
}

/**
 * Factory for creating test messages
 */
export class MessageFactory {
  /**
   * Create a message with default random values
   */
  static create(overrides: Partial<MessageData> = {}): MessageData {
    return {
      id: faker.string.uuid(),
      content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
      senderId: faker.string.uuid(),
      channelId: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides
    };
  }

  /**
   * Create a short message
   */
  static createShort(overrides: Partial<MessageData> = {}): MessageData {
    return this.create({
      content: faker.lorem.sentence({ min: 2, max: 8 }),
      ...overrides
    });
  }

  /**
   * Create a long message (close to limit)
   */
  static createLong(overrides: Partial<MessageData> = {}): MessageData {
    // Create content close to 1000 character limit
    let content = '';
    while (content.length < 950) {
      content += faker.lorem.sentence() + ' ';
    }
    content = content.substring(0, 990).trim();

    return this.create({
      content,
      ...overrides
    });
  }

  /**
   * Create multiple messages for a channel
   */
  static createManyForChannel(
    channelId: string, 
    senderId: string, 
    count: number,
    overrides: Partial<MessageData> = {}
  ): MessageData[] {
    return faker.helpers.multiple(() => this.create({
      channelId,
      senderId,
      ...overrides
    }), { count });
  }
}

/**
 * Factory for creating test errors responses
 */
export class ErrorFactory {
  /**
   * Create a validation error
   */
  static validationError(field: string, reason: string): ErrorResponse {
    return {
      error: 'Validation error',
      message: `${field} ${reason}`,
      code: 'VALIDATION_ERROR',
      details: { field, reason }
    };
  }

  /**
   * Create an unauthorized error
   */
  static unauthorizedError(): ErrorResponse {
    return {
      error: 'Unauthorized',
      message: 'Access token required',
      code: 'UNAUTHORIZED'
    };
  }

  /**
   * Create a not found error
   */
  static notFoundError(resource: string): ErrorResponse {
    return {
      error: 'Not Found',
      message: `${resource} not found`,
      code: 'NOT_FOUND'
    };
  }

  /**
   * Create a conflict error
   */
  static conflictError(message: string): ErrorResponse {
    return {
      error: 'Conflict',
      message,
      code: 'CONFLICT'
    };
  }
}

// Type definitions
export interface UserData {
  id: string;
  email: string;
  name: string;
  password: string;
  title?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelData {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageData {
  id: string;
  content: string;
  senderId: string;
  channelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorResponse {
  error: string;
  message: string;
  code: string;
  details?: any;
}
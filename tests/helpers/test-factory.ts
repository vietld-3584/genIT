import { testEnv } from '../config/test-env';

export interface TestUser {
  email: string;
  password: string;
  name: string;
  title?: string;
}

export interface TestChannel {
  name: string;
  description?: string;
}

export interface TestMessage {
  content: string;
}

export class TestDataFactory {
  private static counter = 0;

  private static getNextId(): number {
    return ++this.counter;
  }

  static generateUser(overrides?: Partial<TestUser>): TestUser {
    const id = this.getNextId();
    return {
      email: `testuser${id}@example.com`,
      password: 'TestPassword123!',
      name: `Test User ${id}`,
      title: `Test Title ${id}`,
      ...overrides,
    };
  }

  static generateChannel(overrides?: Partial<TestChannel>): TestChannel {
    const id = this.getNextId();
    return {
      name: `Test Channel ${id}`,
      description: `Test channel description ${id}`,
      ...overrides,
    };
  }

  static generateMessage(overrides?: Partial<TestMessage>): TestMessage {
    const id = this.getNextId();
    return {
      content: `Test message content ${id}`,
      ...overrides,
    };
  }

  static generateLongString(length: number): string {
    return 'a'.repeat(length);
  }

  static generateValidEmail(): string {
    const id = this.getNextId();
    return `valid${id}@example.com`;
  }

  static generateInvalidEmail(): string {
    return 'invalid-email-format';
  }

  static generateShortPassword(): string {
    return '123';
  }

  static generateLongPassword(): string {
    return this.generateLongString(130);
  }

  static generateValidPassword(): string {
    return 'ValidPass123!';
  }

  static generateEmptyString(): string {
    return '';
  }

  static generateWhitespaceOnlyString(): string {
    return '     ';
  }

  static generateTestImageBuffer(): Buffer {
    // Create a minimal valid JPEG header
    const jpegHeader = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
      0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      // Simplified - this would be a complete JPEG in real scenario
    ]);
    return jpegHeader;
  }

  static generateCorruptedImageBuffer(): Buffer {
    return Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]);
  }

  static generateLargeImageBuffer(): Buffer {
    const size = testEnv.MAX_FILE_SIZE + 1000; // Exceeds limit
    return Buffer.alloc(size);
  }

  static getDefaultTestUser(): TestUser {
    return {
      email: testEnv.TEST_USER_EMAIL,
      password: testEnv.TEST_USER_PASSWORD,
      name: testEnv.TEST_USER_NAME,
    };
  }

  static getMockGoogleToken(): string {
    return testEnv.MOCK_GOOGLE_TOKEN;
  }

  static getMockAppleToken(): string {
    return testEnv.MOCK_APPLE_TOKEN;
  }

  static generateInvalidToken(): string {
    return 'invalid_token_12345';
  }

  static generateExpiredToken(): string {
    return 'expired_token_67890';
  }

  static generateNonExistentId(): string {
    return 'nonexistent_id_' + Date.now();
  }

  static generateValidChannelId(): string {
    return 'ch_123456';
  }

  static generateValidUserId(): string {
    return 'user_123456';
  }

  static generateValidMessageId(): string {
    return 'msg_123456';
  }

  static reset(): void {
    this.counter = 0;
  }
}
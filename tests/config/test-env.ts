import { z } from 'zod';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

export const testEnvSchema = z.object({
  API_URL: z.string().url().default('http://localhost:3000'),
  API_TIMEOUT: z.string().transform((val: string) => parseInt(val, 10)).default(5000),
  NODE_ENV: z.literal('test'),
  
  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform((val: string) => parseInt(val, 10)).default(5432),
  DB_NAME: z.string().default('chatapp_test'),
  DB_USER: z.string().default('test_user'),
  DB_PASSWORD: z.string().default('test_password'),
  
  // Mock tokens
  MOCK_GOOGLE_TOKEN: z.string().default('mock_google_oauth_token_for_testing'),
  MOCK_APPLE_TOKEN: z.string().default('mock_apple_oauth_token_for_testing'),
  
  // Test data
  TEST_USER_EMAIL: z.string().email().default('testuser@example.com'),
  TEST_USER_PASSWORD: z.string().default('testPassword123'),
  TEST_USER_NAME: z.string().default('Test User'),
  
  // File upload
  MAX_FILE_SIZE: z.string().transform((val: string) => parseInt(val, 10)).default(5242880),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png'),
});

function parseTestEnv() {
  try {
    return testEnvSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid test environment variables:');
    if (error instanceof z.ZodError) {
      console.error(error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n'));
    } else {
      console.error(error);
    }
    throw new Error('Test environment validation failed');
  }
}

export const testEnv = parseTestEnv();

export type TestEnvironment = z.infer<typeof testEnvSchema>;
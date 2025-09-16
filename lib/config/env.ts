import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const envSchema = z.object({
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.string().transform((val: string) => parseInt(val, 10)).refine((val: number) => val > 0 && val <= 65535, 'DB_PORT must be a valid port number'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function parseEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      console.error(error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n'));
    } else {
      console.error(error);
    }
    throw new Error('Environment validation failed');
  }
}

export const env = parseEnv();

export type Environment = z.infer<typeof envSchema>;

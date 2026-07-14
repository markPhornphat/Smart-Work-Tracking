import { z } from 'zod';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    DATABASE_HOST: z.string().optional(),
    DATABASE_PORT: z.string().optional(),
    DATABASE_NAME: z.string().optional(),
    DATABASE_USER: z.string().optional(),
    DATABASE_PASSWORD: z.string().optional(),
    DATABASE_URL: z.string().optional(),
    JWT_ACCESS_SECRET: z.string().default('dev-access-secret-change-me'),
    JWT_REFRESH_SECRET: z.string().default('dev-refresh-secret-change-me'),
    JWT_ACCESS_TTL: z.string().default('15m'),
    JWT_REFRESH_TTL: z.string().default('7d'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'test' && !data.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL is required unless NODE_ENV=test',
        path: ['DATABASE_URL'],
      });
    }
  });

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;

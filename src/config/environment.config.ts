// src/config/environment.config.ts

import { z } from 'zod';

const envSchema = z.object({ DUNE_ECHO_API: z.string().min(1, 'DUNE_ECHO_API is required') });

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    console.error('Environment validation failed:', formatted);
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();

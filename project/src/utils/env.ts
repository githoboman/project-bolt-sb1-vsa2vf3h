import { z } from 'zod';

/**
 * Safely get an environment variable with type checking
 * @param key - The environment variable key
 * @param schema - Zod schema for type validation
 * @returns The validated environment variable value
 */
export function getEnvVar<T>(key: string, schema: z.ZodType<T>): T {
  const value = import.meta.env[key];
  return schema.parse(value);
}
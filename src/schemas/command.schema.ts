// src/schemas/command.schema.ts

import { z } from 'zod';
import { SUPPORTED_CHAINS } from '../config/chains.config.ts';
import type { CommandOptions, FilterOptions } from '../types/command.types.ts';

// Custom date validation
const dateSchema = z.string().refine((date) => {
  // Accept both ISO dates and YYYY-MM-DD format
  const isValidDate = !isNaN(Date.parse(date));
  if (!isValidDate) return false;

  // Ensure the date format matches YYYY-MM-DD
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateFormatRegex.test(date);
}, { message: 'Date must be in YYYY-MM-DD format' });

export const filterOptionsSchema = z.object({
  chain: z.string().optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  minValue: z.string().optional(),
  successOnly: z.boolean().optional(),
  limit: z.number().positive().optional()
}) satisfies z.ZodType<FilterOptions>;

export const commandOptionsSchema = z.object({
  addresses: z.array(z.string()).min(1, 'At least one address is required'),
  type: z.enum(['evm-transactions', 'evm-balances', 'svm-transactions', 'svm-balances'] as const),
  filters: filterOptionsSchema
}) satisfies z.ZodType<CommandOptions>;

// Chain schemas
export const evmChainSchema = z.enum(Object.keys(SUPPORTED_CHAINS.evm) as [string, ...string[]]);
export const svmChainSchema = z.enum(Object.keys(SUPPORTED_CHAINS.svm) as [string, ...string[]]);

This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded

## Additional Info

# Directory Structure
```
config/
  chains.config.ts
  environment.config.ts
schemas/
  chain.schema.ts
  command.schema.ts
services/
  dune.service.ts
types/
  api.types.ts
  command.types.ts
utils/
  filters.ts
  logger.ts
index.ts
```

# Files

## File: config/chains.config.ts
```typescript
// src/config/chains.config.ts

export const SUPPORTED_CHAINS = {
  evm: {
    base: { id: 8453, name: 'base' },
    blast: { id: 81457, name: 'blast' },
    ethereum: { id: 1, name: 'ethereum' },
    arbitrum: { id: 42161, name: 'arbitrum' },
    avalanche_c: { id: 43114, name: 'avalanche_c' },
    bnb: { id: 56, name: 'bnb' },
    celo: { id: 42220, name: 'celo' },
    optimism: { id: 10, name: 'optimism' },
    polygon: { id: 137, name: 'polygon' },
    sepolia: { id: 11155111, name: 'sepolia' },
    gnosis: { id: 100, name: 'gnosis' },
    zora: { id: 7777777, name: 'zora' },
    linea: { id: 59144, name: 'linea' },
    fantom: { id: 250, name: 'fantom' },
    zkevm: { id: 1101, name: 'zkevm' },
    scroll: { id: 534352, name: 'scroll' },
    sei: { id: 1329, name: 'sei' }
  },
  svm: { solana: { name: 'solana' } }
} as const;

export type EVMChainName = keyof typeof SUPPORTED_CHAINS.evm;
export type SVMChainName = keyof typeof SUPPORTED_CHAINS.svm;
```

## File: config/environment.config.ts
```typescript
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
```

## File: schemas/chain.schema.ts
```typescript
// src/schemas/chain.schema.ts

import { z } from 'zod';
import { SUPPORTED_CHAINS } from '../config/chains.config.ts';

export const evmChainSchema = z.enum(Object.keys(SUPPORTED_CHAINS.evm) as [string, ...string[]]);
export const svmChainSchema = z.enum(Object.keys(SUPPORTED_CHAINS.svm) as [string, ...string[]]);
```

## File: schemas/command.schema.ts
```typescript
// src/schemas/command.schema.ts

import { z } from 'zod';
import { SUPPORTED_CHAINS } from '../config/chains.config';
import type { CommandOptions, FilterOptions } from '../types/command.types';

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
```

## File: services/dune.service.ts
```typescript
// src/services/dune.service.ts

import { env } from '../config/environment.config.ts';
import type { FetchType } from '../types/api.types.ts';
import { logger } from '../utils/logger.ts';

export class DuneService {
  private static readonly BASE_URL = 'https://api.dune.com/api';

  private static getEndpoint(type: FetchType, address: string): string {
    const endpoints = {
      'evm-transactions': `${this.BASE_URL}/echo/v1/transactions/evm/${address}`,
      'evm-balances': `${this.BASE_URL}/echo/v1/balances/evm/${address}`,
      'svm-transactions': `${this.BASE_URL}/echo/beta/transactions/svm/${address}`,
      'svm-balances': `${this.BASE_URL}/echo/beta/balances/svm/${address}`
    };

    return endpoints[type];
  }

  static async fetchData(address: string, type: FetchType): Promise<any> {
    const endpoint = this.getEndpoint(type, address);

    logger.info({ address, type }, `Fetching data from Dune Echo API`);

    try {
      const res = await fetch(endpoint, { headers: { 'X-Dune-API-Key': env.DUNE_ECHO_API } });

      if (!res.ok) {
        throw new Error(`Failed to fetch ${type} for ${address}: ${res.status} ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      logger.error({ error, address, type }, 'Error fetching data from Dune API');
      throw error;
    }
  }
}
```

## File: types/api.types.ts
```typescript
// src/types/api.types.ts

export interface EVMTransaction {
  chain: string;
  chain_id: number;
  address: string;
  block_time: string;
  block_number: number;
  index: number;
  hash: string;
  block_hash: string;
  value: string;
  transaction_type: string;
  from: string;
  to: string;
  nonce: string;
  gas_price: string;
  gas_used: string;
  effective_gas_price: string;
  success: boolean;
  data: string;
  logs: any[];
}

export interface SVMTransaction {
  signature: string;
  slot: number;
  timestamp: string;
  success: boolean;
  fee: number;
  token: string;
  program: string;
  instruction_name: string;
  instruction_data: any;
  account_keys: string[];
  inner_instructions: any[];
}

export interface EVMBalance {
  chain: string;
  chain_id: number;
  address: string;
  token_address: string | null;
  symbol: string;
  name: string;
  decimals: number;
  raw_balance: string;
  balance: string;
  logo_url: string | null;
}

export interface SVMBalance {
  mint: string;
  owner: string;
  symbol: string;
  name: string;
  decimals: number;
  raw_balance: string;
  balance: string;
  logo_url: string | null;
}

export interface DuneResponse<T> {
  data: T[];
}

export type FetchType = 'evm-transactions' | 'evm-balances' | 'svm-transactions' | 'svm-balances';
```

## File: types/command.types.ts
```typescript
// src/types/command.types.ts

import type { EVMChainName, SVMChainName } from '../config/chains.config.ts';
import type { FetchType } from './api.types.ts';

export interface FilterOptions {
  chain?: string;
  startDate?: string;
  endDate?: string;
  minValue?: string;
  maxValue?: string;
  successOnly?: boolean;
  limit?: number;
  transactionType?: string;
  to?: string[];
  from?: string[];
}

export interface CommandOptions {
  addresses: string[];
  type: FetchType;
  filters: FilterOptions;
}

export type ChainName = EVMChainName | SVMChainName;
```

## File: utils/filters.ts
```typescript
// src/utils/filters.ts

import type { EVMBalance, EVMTransaction, FetchType, SVMBalance, SVMTransaction } from '../types/api.types.ts';
import type { FilterOptions } from '../types/command.types.ts';

function parseDate(dateStr: string): Date {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateStr}`);
  }
  return date;
}

export function applyFilters(
  data: (EVMTransaction | SVMTransaction | EVMBalance | SVMBalance)[],
  type: FetchType,
  filters: FilterOptions
): any[] {
  let filtered = [...data];

  if (type.endsWith('transactions')) {
    filtered = filtered.filter(item => {
      const tx = item as (EVMTransaction | SVMTransaction);
      const timestamp = 'block_time' in tx ? tx.block_time : tx.timestamp;
      const txDate = parseDate(timestamp);

      if (filters.chain && 'chain' in tx && tx.chain !== filters.chain) {
        return false;
      }

      if (filters.startDate) {
        const startDate = parseDate(filters.startDate);
        if (txDate < startDate) return false;
      }

      if (filters.endDate) {
        const endDate = parseDate(filters.endDate);
        if (txDate > endDate) return false;
      }

      if (filters.successOnly && !tx.success) return false;

      if (filters.minValue && 'value' in tx) {
        const value = BigInt(tx.value);
        const minValue = BigInt(filters.minValue);
        if (value < minValue) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      const timeA = 'block_time' in a ? a.block_time : (a as SVMTransaction).timestamp;
      const timeB = 'block_time' in b ? b.block_time : (b as SVMTransaction).timestamp;
      return parseDate(timeB).getTime() - parseDate(timeA).getTime();
    });
  } else {
    filtered = filtered.filter(item => {
      const balance = item as (EVMBalance | SVMBalance);

      if (filters.chain && 'chain' in balance && balance.chain !== filters.chain) {
        return false;
      }

      if (filters.minValue) {
        const value = parseFloat(balance.balance);
        const minValue = parseFloat(filters.minValue);
        if (value < minValue) return false;
      }

      return true;
    });
  }

  if (filters.limit && filters.limit > 0) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered;
}
```

## File: utils/logger.ts
```typescript
// src/utils/logger.ts

import pino from 'pino';

export const logger = pino({ level: 'info', transport: { target: 'pino-pretty', options: { colorize: true } } });
```

## File: index.ts
```typescript
// src/index.ts

import { SUPPORTED_CHAINS } from './config/chains.config.ts';
import { commandOptionsSchema } from './schemas/command.schema.ts';
import { DuneService } from './services/dune.service.ts';
import type { CommandOptions } from './types/command.types.ts';
import { applyFilters } from './utils/filters.ts';
import { logger } from './utils/logger.ts';

export function parseCommandLineArgs(): CommandOptions {
  const args = process.argv.slice(2);
  const options: Partial<CommandOptions> = { addresses: [], type: 'evm-transactions', filters: {} };

  for (let i = 0;i < args.length;i++) {
    const arg = args[i];

    if (i === 0) {
      options.addresses = arg.split(',').map(addr => addr.trim()).filter(Boolean);
      continue;
    }

    switch (arg) {
      case '--type':
        options.type = args[++i] as CommandOptions['type'];
        break;
      case '--chain':
        options.filters = { ...options.filters, chain: args[++i] };
        break;
      case '--start-date':
        // Ensure date is in YYYY-MM-DD format
        const startDate = args[++i];
        options.filters = { ...options.filters, startDate };
        break;
      case '--end-date':
        // Ensure date is in YYYY-MM-DD format
        const endDate = args[++i];
        options.filters = { ...options.filters, endDate };
        break;
      case '--min-value':
        options.filters = { ...options.filters, minValue: args[++i] };
        break;
      case '--success-only':
        options.filters = { ...options.filters, successOnly: true };
        break;
      case '--limit':
        options.filters = { ...options.filters, limit: parseInt(args[++i], 10) };
        break;
    }
  }

  // Validate the parsed options
  const result = commandOptionsSchema.safeParse(options);

  if (!result.success) {
    logger.error(result.error.format(), 'Invalid command options');
    printUsage();
    process.exit(1);
  }

  return result.data;
}

export function validateChain(chain: string | undefined, type: CommandOptions['type']): boolean {
  if (!chain) return true;

  if (type.startsWith('evm')) {
    return chain in SUPPORTED_CHAINS.evm;
  } else {
    return chain in SUPPORTED_CHAINS.svm;
  }
}

function printUsage() {
  const evmChains = Object.keys(SUPPORTED_CHAINS.evm).join(', ');
  const svmChains = Object.keys(SUPPORTED_CHAINS.svm).join(', ');

  logger.info(`
Usage: bun run src/index.ts <address or comma-separated addresses> [options]

Options:
  --type <type>         Data type (evm-transactions, evm-balances, svm-transactions, svm-balances)
  --chain <chain>       Filter by chain
                        EVM chains: ${evmChains}
                        SVM chains: ${svmChains}
  --start-date <date>   Filter from date (format: YYYY-MM-DD, e.g., 2025-01-01)
  --end-date <date>     Filter to date (format: YYYY-MM-DD, e.g., 2025-12-31)
  --min-value <value>   Filter by minimum value
  --success-only        Only show successful transactions
  --limit <number>      Limit number of results

Examples:
  bun run src/index.ts 0x123... --type evm-transactions --chain ethereum --start-date 2025-01-01
  bun run src/index.ts 0x123...,0x456... --type evm-balances --chain polygon --min-value 1000
  bun run src/index.ts sol123... --type svm-transactions --success-only --limit 100
  `);
}

(async () => {
  try {
    const options = parseCommandLineArgs();

    if (!validateChain(options.filters.chain, options.type)) {
      logger.error(`Invalid chain specified for ${options.type}: ${options.filters.chain}`);
      printUsage();
      process.exit(1);
    }

    logger.info({ options }, 'Starting data fetch with options');

    // Fetch data concurrently for all addresses
    const dataArrays = await Promise.all(
      options.addresses.map(address => DuneService.fetchData(address, options.type))
    );

    // Combine and process the results
    let results: any[];
    if (options.type.endsWith('transactions')) {
      const allTransactions = dataArrays.flatMap(data => data.transactions);
      results = applyFilters(allTransactions, options.type, options.filters);
    } else {
      const allBalances = dataArrays.flatMap(data => data.balances);
      results = applyFilters(allBalances, options.type, options.filters);
    }

    logger.info({ resultCount: results.length }, 'Data fetch completed');
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    logger.error(error, 'Error fetching data');
    process.exit(1);
  }
})();
```

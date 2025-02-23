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

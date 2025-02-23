import { afterEach, expect, test } from 'bun:test';
import { env } from '../src/config/environment.config.ts';
import { DuneService } from '../src/services/dune.service.ts';
import { logger } from '../src/utils/logger.ts';

// Backup the original fetch
const originalFetch = globalThis.fetch;

test('DuneService: constructs correct endpoint and returns JSON for evm-transactions', async () => {
  const dummyResponse = { transactions: [] };
  globalThis.fetch = async (input: RequestInfo | URL, options?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    expect(url).toContain(`/echo/v1/transactions/evm/0x123`);
    expect(options?.headers).toEqual({ 'X-Dune-API-Key': env.DUNE_ECHO_API });
    return { ok: true, json: async () => dummyResponse } as Response;
  };

  const result = await DuneService.fetchData('0x123', 'evm-transactions');
  expect(result).toEqual(dummyResponse);
});

test('DuneService: throws an error for non-ok response', async () => {
  globalThis.fetch = async () => {
    return { ok: false, status: 404, statusText: 'Not Found' } as Response;
  };

  await expect(DuneService.fetchData('0x456', 'evm-balances')).rejects.toThrow(
    'Failed to fetch evm-balances for 0x456: 404 Not Found'
  );
});

test('DuneService: logs error and rethrows on fetch failure', async () => {
  const error = new Error('Network error');
  globalThis.fetch = async () => {
    throw error;
  };

  // Spy on logger.error using apply to avoid spread issues
  let logged = false;
  const originalLoggerError = logger.error;
  logger.error = ((...args: any[]) => {
    logged = true;
    return originalLoggerError.apply(logger, args[0]);
  }) as typeof logger.error;

  expect(DuneService.fetchData('0x789', 'svm-transactions')).rejects.toThrow(error);
  expect(logged).toBe(true);

  // Restore logger.error
  logger.error = originalLoggerError;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

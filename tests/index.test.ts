import { afterEach, expect, test } from 'bun:test';
import { parseCommandLineArgs, validateChain } from '../src/index.ts';

const originalArgv = process.argv.slice();
const originalExit = process.exit;

test('parseCommandLineArgs: correctly parses valid command-line arguments', () => {
  process.argv = [
    'bun',
    'src/index.ts',
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    '--type',
    'evm-transactions',
    '--chain',
    'ethereum',
    '--start-date',
    '2025-02-21',
    '--end-date',
    '2025-02-22',
    '--min-value',
    '1000',
    '--success-only',
    '--limit',
    '10'
  ];
  const options = parseCommandLineArgs();
  expect(options.addresses).toEqual(['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']);
  expect(options.type).toBe('evm-transactions');
  expect(options.filters.chain).toBe('ethereum');
  expect(options.filters.startDate).toBe('2025-02-21');
  expect(options.filters.endDate).toBe('2025-02-22');
  expect(options.filters.minValue).toBe('1000');
  expect(options.filters.successOnly).toBe(true);
  expect(options.filters.limit).toBe(10);
});

test('parseCommandLineArgs: exits when addresses are missing', () => {
  process.argv = ['bun', 'src/index.ts', '', '--type', 'evm-transactions'];
  expect(() => {
    parseCommandLineArgs();
  }).toThrow(/process.exit/);
});

test('parseCommandLineArgs: exits when date format is invalid', () => {
  process.argv = ['bun', 'src/index.ts', '0x123', '--start-date', '01-01-2025'];
  expect(() => {
    parseCommandLineArgs();
  }).toThrow(/process.exit/);
});

test('validateChain: returns true for a valid evm chain', () => {
  expect(validateChain('ethereum', 'evm-transactions')).toBe(true);
});

test('validateChain: returns true for a valid svm chain', () => {
  expect(validateChain('solana', 'svm-transactions')).toBe(true);
});

test('validateChain: returns false for an invalid chain', () => {
  expect(validateChain('nonexistent', 'evm-balances')).toBe(false);
});

afterEach(() => {
  process.argv = originalArgv;
  process.exit = originalExit;
});

import { expect, test } from 'bun:test';
import { applyFilters } from '../src/utils/filters.ts';

// Create dummy transactions with all required EVMTransaction properties
const dummyTransactions = [{
  chain: 'ethereum',
  chain_id: 1,
  address: '0xabc',
  block_time: '2025-01-05',
  block_number: 100,
  index: 0,
  hash: '0xhash1',
  block_hash: '0xbhash1',
  value: '1000',
  transaction_type: 'transfer',
  from: '0xfrom',
  to: '0xto',
  nonce: '1',
  gas_price: '100',
  gas_used: '21000',
  effective_gas_price: '100',
  success: true,
  data: '',
  logs: []
}, {
  chain: 'ethereum',
  chain_id: 1,
  address: '0xdef',
  block_time: '2025-01-03',
  block_number: 90,
  index: 1,
  hash: '0xhash2',
  block_hash: '0xbhash2',
  value: '2000',
  transaction_type: 'transfer',
  from: '0xfrom2',
  to: '0xto2',
  nonce: '2',
  gas_price: '100',
  gas_used: '21000',
  effective_gas_price: '100',
  success: false,
  data: '',
  logs: []
}, {
  chain: 'polygon',
  chain_id: 137,
  address: '0xghi',
  block_time: '2025-01-04',
  block_number: 80,
  index: 0,
  hash: '0x0000',
  block_hash: '0xbhash3',
  value: '500',
  transaction_type: 'transfer',
  from: '0xfrom3',
  to: '0xto3',
  nonce: '3',
  gas_price: '100',
  gas_used: '21000',
  effective_gas_price: '100',
  success: true,
  data: '',
  logs: []
}];

test('applyFilters: filters transactions by chain', () => {
  const filters = { chain: 'ethereum' };
  const result = applyFilters(dummyTransactions, 'evm-transactions', filters);
  expect(result.every((tx: any) => tx.chain === 'ethereum')).toBe(true);
});

test('applyFilters: filters transactions by startDate and endDate', () => {
  const filters = { startDate: '2025-01-04', endDate: '2025-01-06' };
  const result = applyFilters(dummyTransactions, 'evm-transactions', filters);
  expect(result.length).toBe(2);
  expect(result[0].block_time).toBe('2025-01-05');
});

test('applyFilters: filters transactions by successOnly', () => {
  const filters = { successOnly: true };
  const result = applyFilters(dummyTransactions, 'evm-transactions', filters);
  expect(result.every((tx: any) => tx.success === true)).toBe(true);
});

test('applyFilters: filters transactions by minValue', () => {
  const filters = { minValue: '1500' };
  const result = applyFilters(dummyTransactions, 'evm-transactions', filters);
  expect(result.every((tx: any) => BigInt(tx.value) >= BigInt(1500))).toBe(true);
});

test('applyFilters: sorts transactions by descending date', () => {
  const filters = {};
  const result = applyFilters(dummyTransactions, 'evm-transactions', filters);
  expect(result[0].block_time).toBe('2025-01-05');
});

test('applyFilters: applies limit filter for transactions', () => {
  const filters = { limit: 2 };
  const result = applyFilters(dummyTransactions, 'evm-transactions', filters);
  expect(result.length).toBeLessThanOrEqual(2);
});

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
// Dummy balances data for "evm-balances" (using minimal required properties)
const dummyBalances = [
  {
    chain: 'ethereum',
    chain_id: 1,
    address: '0xabc',
    token_address: '0xabc',
    symbol: 'eth',
    name: 'ethereum',
    decimals: 18,
    raw_balance: '1000000000',
    balance: '1',
    logo_url: 'https://simpleicons.org/?modal=icon&q=ethereum'
  }
  //   { chain: 'ethereum', balance: '500' },
  //   { chain: 'polygon', balance: '2000' }
];

test('applyFilters: filters balances by chain', () => {
  const filters = { chain: 'ethereum' };
  const result = applyFilters(dummyBalances, 'evm-balances', filters);
  expect(result.every((b: any) => b.chain === 'ethereum')).toBe(true);
});

test('applyFilters: filters balances by minValue', () => {
  const filters = { minValue: '1000' };
  const result = applyFilters(dummyBalances, 'evm-balances', filters);
  expect(result.every((b: any) => parseFloat(b.balance) >= 1000)).toBe(true);
});

test('applyFilters: applies limit filter for balances', () => {
  const filters = { limit: 1 };
  const result = applyFilters(dummyBalances, 'evm-balances', filters);
  expect(result.length).toBe(1);
});

test('applyFilters: throws error for invalid date format', () => {
  const filters = { startDate: 'invalid-date' };
  expect(() => {
    applyFilters(dummyTransactions, 'evm-transactions', filters);
  }).toThrow();
});

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

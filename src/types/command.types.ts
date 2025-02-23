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

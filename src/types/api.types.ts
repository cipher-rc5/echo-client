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

import { z } from 'zod';

export const evm_tx_response_schema_template = z.object({
  chain: z.string(),
  chain_id: z.number(),
  address: z.string(),
  block_time: z.string(),
  block_number: z.number(),
  index: z.number(),
  hash: z.string(),
  block_hash: z.string(),
  value: z.string(),
  transaction_type: z.string(),
  from: z.string(),
  to: z.string(),
  nonce: z.string(),
  gas_price: z.string(),
  gas_used: z.string(),
  effective_gas_price: z.string(),
  success: z.boolean(),
  data: z.string(),
  logs: z.array(z.unknown())
});

// src/schemas/chain.schema.ts

import { z } from 'zod';
import { SUPPORTED_CHAINS } from '../config/chains.config.ts';

export const evmChainSchema = z.enum(Object.keys(SUPPORTED_CHAINS.evm) as [string, ...string[]]);
export const svmChainSchema = z.enum(Object.keys(SUPPORTED_CHAINS.svm) as [string, ...string[]]);

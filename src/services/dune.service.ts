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

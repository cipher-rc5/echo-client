// src/config/chains.config.ts

export const SUPPORTED_CHAINS = {
  evm: {
    base: { id: 8453, name: 'base' },
    blast: { id: 81457, name: 'blast' },
    ethereum: { id: 1, name: 'ethereum' },
    arbitrum: { id: 42161, name: 'arbitrum' },
    avalanche_c: { id: 43114, name: 'avalanche_c' },
    bnb: { id: 56, name: 'bnb' },
    celo: { id: 42220, name: 'celo' },
    optimism: { id: 10, name: 'optimism' },
    polygon: { id: 137, name: 'polygon' },
    sepolia: { id: 11155111, name: 'sepolia' },
    gnosis: { id: 100, name: 'gnosis' },
    zora: { id: 7777777, name: 'zora' },
    linea: { id: 59144, name: 'linea' },
    fantom: { id: 250, name: 'fantom' },
    zkevm: { id: 1101, name: 'zkevm' },
    scroll: { id: 534352, name: 'scroll' },
    sei: { id: 1329, name: 'sei' }
  },
  svm: { solana: { name: 'solana' } }
} as const;

export type EVMChainName = keyof typeof SUPPORTED_CHAINS.evm;
export type SVMChainName = keyof typeof SUPPORTED_CHAINS.svm;

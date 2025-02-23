import { afterEach, expect, test } from 'bun:test';

// Preserve original environment and process.exit
const originalEnv = { ...process.env };
const originalExit = process.exit;

test('environment.config: returns validated environment when valid', () => {
  process.env.DUNE_ECHO_API = 'valid-api-key';
  // Clear the module cache if necessary so that the module re-validates
  const envModule = require('../src/config/environment.config');
  expect(envModule.env.DUNE_ECHO_API).toBe('valid-api-key');
});

test('environment.config: exits when DUNE_ECHO_API is missing', () => {
  delete process.env.DUNE_ECHO_API;
  expect(() => {
    require('../src/config/environment.config');
  }).toThrow(/process.exit/);
});

afterEach(() => {
  process.env = { ...originalEnv };
  process.exit = originalExit;
});

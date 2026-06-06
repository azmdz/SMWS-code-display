import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 30000,
  expect: { timeout: 15000 },
  globalSetup: './tests/global-setup.js',
  use: {
    screenshot: 'only-on-failure',
  },
});

import { test as base, chromium } from '@playwright/test';
import fs from 'fs';
import { USER_DATA_DIR, SENTINEL, EXTENSION_PATH } from './config.js';

export const test = base.extend({
  extensionContext: [async ({}, use) => {
    const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
    });
    await use(context);
    await context.close();
  }, { scope: 'worker' }],

  page: async ({ extensionContext }, use, testInfo) => {
    testInfo.skip(!fs.existsSync(SENTINEL), 'ログインが未完了のためスキップ');
    const page = await extensionContext.newPage();
    await use(page);
    await page.close();
  },
});

export const expect = base.expect;

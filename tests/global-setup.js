import { chromium } from '@playwright/test';
import fs from 'fs';
import { USER_DATA_DIR, SENTINEL, EXTENSION_PATH } from './config.js';

export default async function globalSetup() {
  if (fs.existsSync(SENTINEL)) return;

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });

  const page = await context.newPage();
  try {
    await page.goto('https://smwsjapan.com/account/top');
    console.log('\nブラウザでログインしてください。ログイン完了後、自動的に続行されます。\n');
    await page.waitForURL('**/account/top', { timeout: 120000 });
    fs.writeFileSync(SENTINEL, new Date().toISOString());
    console.log('ログイン情報を保存しました。次回からはログイン不要です。\n');
  } catch (e) {
    if (e.name === 'TimeoutError') {
      console.warn('\nログインがタイムアウトしました。テストはスキップされます。\n');
    } else {
      throw e;
    }
  } finally {
    await context.close();
  }
}

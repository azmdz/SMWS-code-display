import { test, expect } from './fixtures.js';
import { BASE_URL, ORDER_ID } from './config.js';

async function expectBadge(page, url) {
  await page.goto(url);
  await expect(page.locator('.smws-distillery-badge').first()).toBeVisible();
}

test('商品一覧に蒸留所名バッジが表示される', async ({ page }) => {
  await expectBadge(page, `${BASE_URL}/product/list`);
});

test('お気に入りページに蒸留所名バッジが表示される', async ({ page }) => {
  await expectBadge(page, `${BASE_URL}/account/favorite/list`);
});

test('マイページに蒸留所名バッジが表示される', async ({ page }) => {
  await expectBadge(page, `${BASE_URL}/account/top`);
});

test('注文詳細に蒸留所名バッジが表示される', async ({ page }) => {
  if (!ORDER_ID) {
    test.skip(true, 'SMWS_ORDER_IDが未設定のためスキップ');
    return;
  }
  await expectBadge(page, `${BASE_URL}/account/order-history/detail/${ORDER_ID}`);
});

test('蒸留所コードのクリアボタンでinputがリセットされる', async ({ page }) => {
  await page.goto(`${BASE_URL}/product/list`);
  const input = page.locator('#tag_code_input');
  await expect(input).toBeVisible();
  await input.fill('41.');
  await expect(input).toHaveValue('41.');
  await page.locator('.smws-clear-btn').click();
  await expect(input).toHaveValue('');
});

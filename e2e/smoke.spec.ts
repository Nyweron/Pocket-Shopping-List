import { test, expect } from '@playwright/test';

async function loginDemo(page: any) {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('demo@test.pl');
  await page.getByTestId('login-password').fill('demo123');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/$/);
}

async function createListAndOpen(page: any, prefix = 'Smoke list') {
  const name = `${prefix} ${Date.now()}`;
  await page.getByTestId('create-list-btn').click();
  await page.getByTestId('new-list-name-input').fill(name);
  await page.getByTestId('create-list-submit').click();
  const createdCard = page.locator('[data-testid^="list-card-"]').filter({ hasText: name }).first();
  await expect(createdCard).toBeVisible();
  await createdCard.click();
  return name;
}

test.describe('Smoke flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('demo login -> create list -> add product -> mark purchased', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page);

    await page.getByTestId('add-custom-toggle').click();
    await page.getByTestId('custom-product-name').fill('Produkt smoke');
    await page.getByTestId('custom-product-submit').click();

    const firstCheckbox = page.locator('[data-testid^="product-checkbox-"]').first();
    await expect(firstCheckbox).toBeVisible();
    await firstCheckbox.click();
  });

  test('edit product quantity/unit -> save -> refresh -> persists', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Edit flow');

    await page.getByTestId('add-custom-toggle').click();
    await page.getByTestId('custom-product-name').fill('Do edycji');
    await page.getByTestId('custom-product-submit').click();

    const firstItem = page.locator('[data-testid^="product-item-"]').first();
    await firstItem.click();
    await page.locator('.edit-quantity-input').fill('2');
    await page.locator('.edit-unit-select').selectOption('kg');
    await page.getByTestId('edit-save-btn').click();

    await page.reload();
    await expect(page.getByText('Ilość: 2 kg').first()).toBeVisible();
  });

  test('sorting and list search from menu', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Sort flow');

    await page.getByTestId('add-custom-toggle').click();
    await page.getByTestId('custom-product-name').fill('Sortowany');
    await page.getByTestId('custom-product-submit').click();
    await page.getByTestId('open-options-menu').click();
    await page.getByTestId('open-sort-sheet').click();
    await page.getByTestId('sort-option-name').click();
    await page.getByTestId('open-options-menu').click();
    await expect(page.getByTestId('open-sort-sheet')).toContainText('Alfabetycznie');

    await page.getByTestId('list-search-input').fill('xyz_not_found');
    await expect(page.getByText('Brak produktów w tej liście.')).toBeVisible();
  });

  test('remove purchased products with confirm dialog', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Remove flow');

    await page.getByTestId('add-custom-toggle').click();
    await page.getByTestId('custom-product-name').fill('Do usunięcia');
    await page.getByTestId('custom-product-submit').click();

    const firstCheckbox = page.locator('[data-testid^="product-checkbox-"]').first();
    await firstCheckbox.click();

    page.on('dialog', dialog => dialog.accept());
    await page.getByTestId('open-options-menu').click();
    await page.getByTestId('remove-purchased-products').click();

    await expect(page.getByText('Do usunięcia')).toHaveCount(0);
  });
});

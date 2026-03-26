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

    await page.getByTestId('fab-add-products').click();
    await expect(page).toHaveURL(/\/add$/);
    await page.getByTestId('add-products-search-input').fill('Produkt smoke');
    await page.getByTestId('add-custom-suggestion').click();
    await page.getByTestId('add-page-back').click();
    await expect(page).not.toHaveURL(/\/add$/);

    const firstCheckbox = page.locator('[data-testid^="product-checkbox-"]').first();
    await expect(firstCheckbox).toBeVisible();
    await firstCheckbox.click();
  });

  test('edit product quantity/unit -> save -> refresh -> persists', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Edit flow');

    await page.getByTestId('fab-add-products').click();
    await page.getByTestId('add-products-search-input').fill('Do edycji');
    await page.getByTestId('add-custom-suggestion').click();
    await page.getByTestId('add-page-back').click();

    const firstItem = page.locator('[data-testid^="product-item-"]').first();
    await firstItem.click();
    await page.locator('.edit-quantity-input').fill('2');
    await page.locator('.edit-unit-select').selectOption('kg');
    await page.getByTestId('edit-save-btn').click();

    await page.reload();
    await expect(page.getByText('Ilość: 2 kg').first()).toBeVisible();
  });

  test('sorting from menu', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Sort flow');

    await page.getByTestId('fab-add-products').click();
    await page.getByTestId('add-products-search-input').fill('Sortowany');
    await page.getByTestId('add-custom-suggestion').click();
    await page.getByTestId('add-page-back').click();
    await page.getByTestId('open-options-menu').click();
    await page.getByTestId('open-sort-sheet').click();
    await page.getByTestId('sort-option-name').click();
    await page.getByTestId('open-options-menu').click();
    await expect(page.getByTestId('open-sort-sheet')).toContainText('Alfabetycznie');
  });

  test('swipe row left keeps delete strip open (swiped class)', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Swipe open');

    await page.getByTestId('fab-add-products').click();
    await page.getByTestId('add-products-search-input').fill('SwipeRowItem');
    await page.getByTestId('add-custom-suggestion').click();
    await page.getByTestId('add-page-back').click();

    const row = page.locator('[data-testid^="product-item-"]').filter({ hasText: 'SwipeRowItem' });
    await expect(row).toBeVisible();
    const box = await row.boundingBox();
    expect(box).toBeTruthy();
    // Start drag on the right side of the row (avoid checkbox on the left)
    const startX = box!.x + box!.width - 32;
    const startY = box!.y + box!.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 120, startY);
    await page.mouse.up();

    await expect(row).toHaveClass(/swiped/);
  });

  test('swipe open then tap delete removes product (confirm)', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Swipe delete');

    await page.getByTestId('fab-add-products').click();
    await page.getByTestId('add-products-search-input').fill('DeleteSwipeItem');
    await page.getByTestId('add-custom-suggestion').click();
    await page.getByTestId('add-page-back').click();

    const row = page.locator('[data-testid^="product-item-"]').filter({ hasText: 'DeleteSwipeItem' });
    await expect(row).toBeVisible();
    const box = await row.boundingBox();
    expect(box).toBeTruthy();
    const startX = box!.x + box!.width - 32;
    const startY = box!.y + box!.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 120, startY);
    await page.mouse.up();

    await expect(row).toHaveClass(/swiped/);

    const deleteBtn = row.locator('[data-testid^="swipe-delete-"]');
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();
    const deleteDialog = page.getByRole('alertdialog');
    await expect(deleteDialog).toBeVisible();
    await deleteDialog.getByRole('button', { name: /^(Potwierdź|Confirm)$/ }).click();
    await expect(page.getByTestId('app-dialog')).toHaveCount(0);

    await expect(page.getByText('DeleteSwipeItem')).toHaveCount(0);
  });

  test('checkbox: mark purchased then uncheck — item moves between sections', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Toggle purchased');

    await page.getByTestId('fab-add-products').click();
    await page.getByTestId('add-products-search-input').fill('Pantofle test');
    await page.getByTestId('add-custom-suggestion').click();
    await page.getByTestId('add-page-back').click();

    const rowCandidates = page
      .locator('[data-testid^="product-item-"]')
      .filter({ hasText: 'Pantofle test' });

    const candidatesCount = await rowCandidates.count();
    let productId: string | null = null;

    // Pick the specific product row that is NOT marked as purchased (before toggling).
    for (let i = 0; i < candidatesCount; i++) {
      const row = rowCandidates.nth(i);
      const rowTestId = await row.getAttribute('data-testid');
      if (!rowTestId) continue;
      const id = rowTestId.replace('product-item-', '');

      const isPurchased = await row.evaluate((el: Element) => el.classList.contains('purchased'));
      if (!isPurchased) {
        productId = id;
        break;
      }
    }

    expect(productId).not.toBeNull();

    const checkbox = page.locator(`[data-testid="product-checkbox-${productId}"]`).first();
    const rowPurchased = page.locator(`[data-testid="product-item-${productId}"].purchased`).first();
    const rowUnpurchased = page.locator(
      `[data-testid="product-item-${productId}"]:not(.purchased)`
    ).first();

    await expect(checkbox).not.toBeChecked();
    await expect(rowPurchased).toHaveCount(0);
    await expect(rowUnpurchased).toBeVisible();

    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await expect(rowPurchased).toBeVisible();

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    await expect(rowPurchased).toHaveCount(0);
  });

  test('remove purchased products with confirm dialog', async ({ page }) => {
    await loginDemo(page);
    await createListAndOpen(page, 'Remove flow');

    await page.getByTestId('fab-add-products').click();
    await page.getByTestId('add-products-search-input').fill('Do usunięcia');
    await page.getByTestId('add-custom-suggestion').click();
    await page.getByTestId('add-page-back').click();

    const firstCheckbox = page.locator('[data-testid^="product-checkbox-"]').first();
    await firstCheckbox.click();

    await page.getByTestId('open-options-menu').click();
    await page.getByTestId('remove-purchased-products').click();
    const removeDialog = page.getByRole('alertdialog');
    await expect(removeDialog).toBeVisible();
    await removeDialog.getByRole('button', { name: /^(Potwierdź|Confirm)$/ }).click();
    await expect(page.getByTestId('app-dialog')).toHaveCount(0);

    await expect(page.getByText('Do usunięcia')).toHaveCount(0);
  });
});

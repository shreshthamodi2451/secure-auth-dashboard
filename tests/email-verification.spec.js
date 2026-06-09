const { test, expect } = require('@playwright/test');

test('new user is redirected to verify email page', async ({ page }) => {

  const timestamp = Date.now();

  const uniqueEmail =
    `test${timestamp}@gmail.com`;

  const uniqueUsername =
    `user${timestamp}`;

  await page.goto(
    'http://localhost:3000/register'
  );

  await page.fill(
    '#username',
    uniqueUsername
  );

  await page.fill(
    '#email',
    uniqueEmail
  );

  await page.fill(
    '#password',
    'Password123'
  );

  await page.fill(
    '#confirmPassword',
    'Password123'
  );

  await page.selectOption(
    'select[name="role"]',
    'user'
  );

  await page.click(
    'button[type="submit"]'
  );

  // Print any error message on page
  const pageText =
    await page.locator('body').textContent();

  //console.log(pageText);


await page.waitForURL(
  '**/verify-email',
  { timeout: 15000 }
);

});
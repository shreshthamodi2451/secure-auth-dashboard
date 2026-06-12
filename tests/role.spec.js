// import { test, expect } from '@playwright/test';

// test.use({
//   storageState: 'playwright/.auth/admin.json'
// });

// test(
//   'admin clicking Users redirects to users page',
//   async ({ page }) => {

//     await page.goto(
//       'http://localhost:3000/dashboard'
//     );



// console.log("URL:", page.url());

// console.log(
//   await page.locator('body').textContent()
// );
// //   await page.waitForTimeout(3000);

// // console.log(
// //   "FINAL URL:",
// //   page.url()
// // );

// // await page.pause();


// await page.getByRole(
//   'button',
//   {
//     name: 'Users',
//     exact: true
//   }
// ).click();

//     await expect(page)
//       .toHaveURL(/users/);

//   }
// );

// test('user cannot see View All Users button', async ({ page }) => {

//   // Login as normal user
//   // Complete OTP
//   // Reach dashboard

//   await expect(
//     page.getByRole('button', {
//       name: 'View All Users'
//     })
//   ).not.toBeVisible();

// });
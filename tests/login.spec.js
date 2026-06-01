import {test, expect} from '@playwright/test'

test('login page loads' , async({ page }) => {
    //first go to the login page
    await page.goto('http://localhost:3000/login')
    await expect(
        page.getByText('welcome back')
    ).toBeVisible();

    await expect(
        page.getByPlaceholder('name@example.com')
    ).toBeVisible();

    await expect(
        page.getByPlaceholder('••••••••')
    ).toBeVisible();

    await expect(
        page.getByRole('button', {name: 'Sign in'})
    ).toBeVisible;
});

test('invalid pw check' , async({ page }) => {
    //first go to the login page
    await page.goto('http://localhost:3000/login')



    await 
        page.getByPlaceholder('name@example.com').fill('fakeuser@gmail.com');

    await
        page.getByPlaceholder('••••••••').fill('wrongpassword');

    await
        page.getByRole('button', {name: 'Sign in'}).click();

        await expect(
    page.getByText(/invalid email or password/i)
  ).toBeVisible();
});
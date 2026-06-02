//its only job is to login once then complete otp once then reachdashboard then save session
//after this playwright creates playwright/.auth/admin.json
//now this contains cookies, localStrorage(token, email, role, username)

import {test} from '@playwright/test'

test('authentication', async({page}) => {

    //goto login page
    await page.goto('http://localhost:3000/login');

    //login manually
    await page.getByPlaceholder('name@example.com').fill('shreshthamodi2451@gmail.com');

      await page.getByPlaceholder('••••••••')
    .fill('shreshtha2451');

    await page.getByRole('button', {name: 'Sign In'}).click();

    //complete otp
    await page.pause();

     await page.context().storageState({
    path: 'playwright/.auth/admin.json'
  });

});
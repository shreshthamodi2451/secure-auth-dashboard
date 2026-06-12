const { test, expect } = require("@playwright/test");

test(
  "authenticator option shows generate qr button",
  async ({ page }) => {

    await page.goto(
      "http://localhost:3000/setup-2fa"
    );

    await page.selectOption(
      "select",
      "authenticator"
    );

    await expect(
      page.getByRole("button", {
        name: /generate qr code/i
      })
    ).toBeVisible();

  }
);

test(
  "email otp hides qr button",
  async ({ page }) => {

    await page.goto(
      "http://localhost:3000/setup-2fa"
    );

    await page.selectOption(
      "select",
      "email"
    );

    await expect(
      page.getByRole("button", {
        name: /generate qr code/i
      })
    ).toHaveCount(0);

  }
);

test(
  "continue with email otp redirects",
  async ({ page }) => {

    await page.route(
      "http://localhost:5001/api/set-2fa-method",
      async route => {

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true
          })
        });

      }
    );

    await page.goto(
      "http://localhost:3000/setup-2fa"
    );

    await page.evaluate(() => {

      localStorage.setItem(
        "userId",
        "test-user"
      );

    });

    await page.reload();

    await page.selectOption(
      "select",
      "email"
    );

    await page.getByRole(
      "button",
      {
        name:
          /continue with email otp/i
      }
    ).click();

    await expect(page)
      .toHaveURL(/email-otp/);

  }
);
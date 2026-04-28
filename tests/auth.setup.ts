import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
setup('QX-2: Auth - Successful login with valid credentials', async ({ page }) => {
  await page.goto('https://qa-sandbox-deploy.vercel.app/');

  // Input Email
  await page.getByRole('textbox', { name: 'Email Address *' }).fill('admin@qabox.dev');

  // Input Password
  await page.getByRole('textbox', { name: 'Master Password *' }).fill('Admin@123!');

  // Klik Captcha/Checkbox
  await page.getByLabel('I am not a robot').click();

  // Klik Button Login
  await page.getByRole('button', { name: 'Login to System' }).click();
  const dashboardHeader = page.getByText('QA Sandbox');
  await expect(dashboardHeader).toBeVisible(); 
  await expect(page).toHaveURL('https://qa-sandbox-deploy.vercel.app/'); 

  // Simpan session
  await page.context().storageState({ path: authFile });
});
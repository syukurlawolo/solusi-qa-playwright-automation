import { test, expect } from '@playwright/test';

test('QX-2: Auth - Successful login with valid credentials', async ({ page }) => {
  // Buka halaman login
  await page.goto('https://qa-sandbox-deploy.vercel.app/');

  // Input Email
  await page.getByRole('textbox', { name: 'Email Address *' }).fill('admin@qabox.dev');

  // Input Password
  await page.getByRole('textbox', { name: 'Master Password *' }).fill('Admin@123!');

  // Klik Captcha/Checkbox
  await page.getByLabel('I am not a robot').click();

  // Klik Button Login
  await page.getByRole('button', { name: 'Login to System' }).click();

  // --- VALIDASI (ASERSION) ---
  // Pastikan muncul teks "QA Sandbox" sebagai tanda login berhasil
  const dashboardHeader = page.getByText('QA Sandbox');
  await expect(dashboardHeader).toBeVisible(); 
});
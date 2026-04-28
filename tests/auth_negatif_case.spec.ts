import { test, expect } from '@playwright/test';

test.describe('Auth', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://qa-sandbox-deploy.vercel.app/auth');
    })


    test('QX-32: Auth - Toggle Password Visibility Validation', async ({ page }) => {
        const passwordField = page.getByRole('textbox', { name: 'Master Password *' });
        await page.getByRole('textbox', { name: 'Master Password *' }).click();
        await page.getByRole('textbox', { name: 'Master Password *' }).fill('Password123!');
        await page.getByRole('button', { name: 'Show password' }).click();
        await expect(passwordField).toHaveAttribute('type', 'text');
        await page.getByRole('button', { name: 'Hide password' }).click();
        await expect(passwordField).toHaveAttribute('type', 'password');
    });

    test('QX-12: Auth - Email Verification Validation', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Email Address *' }).click();
        await page.getByRole('textbox', { name: 'Email Address *' }).fill('test');
        await expect(page.locator('#email-error')).toContainText('Please enter a highly valid email address.');
        await page.getByRole('textbox', { name: 'Email Address *' }).click();
        await page.getByRole('textbox', { name: 'Email Address *' }).fill('test@gmail.');
        await expect(page.locator('#email-error')).toContainText('Please enter a highly valid email address.');
        await page.getByRole('textbox', { name: 'Email Address *' }).click();
        await page.getByRole('textbox', { name: 'Email Address *' }).fill('test@gmail.c');
        await expect(page.locator('#email-error')).toContainText('Please enter a highly valid email address.');

    });

    test('QX-33: Auth Login Button Disabled by Default', async ({ page }) => {
        const loginButton = page.getByRole('button', { name: 'Login to System' });
        await expect(loginButton).toBeDisabled()

    });

    test('QX-30: Validation Password Message', async ({ page }) => {
        const passwordField = page.getByRole('textbox', { name: 'Master Password *' });
        const errorContainer = page.locator('#complex-auth-form');

        // Case 1: Less than 8 characters
        await passwordField.fill('pasX12@');
        await expect(errorContainer).toContainText('Must be > 8 characters');

        // Case 2: No special character
        await passwordField.fill('pasX12345');
        await expect(errorContainer).toContainText('Must contain a special character');

        // Case 3: No uppercase letter
        await passwordField.fill('pas@12345');
        await expect(errorContainer).toContainText('Must contain an uppercase letter');

        // Case 4: No lowercase letter
        await passwordField.fill('PAS@12345');
        await expect(errorContainer).toContainText('Must contain a lowercase letter');

        // Cleanup: Clear field
        await passwordField.fill('');


    });

    test('QX-14: Auth Login Attempt with Password Empty Fields', async ({ page }) => {

        await page.getByRole('textbox', { name: 'Email Address *' }).fill('test@example.id')
        const loginButton = page.getByRole('button', { name: 'Login to System' });
        await expect(loginButton).toBeDisabled()
    })

    test('QX-29: Auth Login Attempt with Email Empty Fields', async ({ page }) => {
        const loginButton = page.getByRole('button', { name: 'Login to System' });
        await page.getByRole('textbox', { name: 'Master Password *' }).fill('test@example.id')
        await expect(loginButton).toBeDisabled()
    })

    test('QX-16: Auth - Login Failed - Incorrect Password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Email Address *' }).click();
        await page.getByRole('textbox', { name: 'Email Address *' }).fill('admin@qabox.dev');
        await page.getByRole('textbox', { name: 'Master Password *' }).click();
        await page.getByRole('textbox', { name: 'Master Password *' }).fill('password@A123');
        await page.getByLabel('I am not a robot').click();
        await page.getByRole('button', { name: 'Login to System' }).click();
        await expect(page.locator('#login-error')).toContainText('Invalid credentials');
    });

    test('QX-17: Auth - Login Failed - Unregistered Email', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Email Address *' }).click();
        await page.getByRole('textbox', { name: 'Email Address *' }).fill('admin@qabox.de');
        await page.getByRole('textbox', { name: 'Master Password *' }).click();
        await page.getByRole('textbox', { name: 'Master Password *' }).press('ControlOrMeta+a');
        await page.getByRole('textbox', { name: 'Master Password *' }).fill('Admin@123!');
        await page.getByLabel('I am not a robot').click();
        await page.getByRole('button', { name: 'Login to System' }).click();
        await expect(page.locator('#login-error')).toContainText('Invalid credentials');

    });

})

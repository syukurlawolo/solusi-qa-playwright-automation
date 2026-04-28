import { test, expect } from '@playwright/test';

test.describe('Employee Module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://qa-sandbox-deploy.vercel.app/');
        await page.getByRole('link', { name: 'Employees' }).click();
        await expect(page.getByRole('heading', { name: 'Employee Management' })).toBeVisible();

    });


    test('QX-20: Display Employee List on Dashboard', async ({ page }) => {
        const firstCell = page.locator('tbody tr td').nth(1); 
        await expect(firstCell).toBeVisible();
        const employeeName = await firstCell.innerText();
        const tableBody = page.locator('tbody');
        await expect(tableBody).toContainText(employeeName);
    });

    test('QX-22: Add New Employee with Complete Data', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Employee' }).click();
        await page.locator('#emp-first-name').fill('Aliezer');
        await page.locator('#emp-last-name').fill('Dolly');
        await page.locator('#emp-position').fill('Manager');
        await page.locator('#emp-salary').fill('5000000');

        await page.getByRole('button', { name: 'Create' }).click();


        // Memastikan data yang baru dibuat muncul di tabel
        const newRow = page.locator('tbody tr').filter({ hasText: 'Aliezer Dolly' });

        await expect(newRow).toBeVisible();
        await expect(newRow).toContainText('Manager');
        await expect(newRow).toContainText('$5,000,000');
    });

    test('QX-23: Edit Employee', async ({ page }) => {

        const employeeRow = page.locator('tbody tr').filter({ hasText: 'Aliezer Dolly' });
        await employeeRow.locator('.text-blue-600').click();
        await page.locator('#emp-first-name').fill('Herman');
        await page.locator('#emp-last-name').fill('Abdul');
        await page.locator('#emp-position').fill('Quality Assurance');
        await page.locator('#emp-salary').fill('9000000');
        await page.locator('#emp-hire-date').fill('2020-06-04');
        await page.getByRole('button', { name: 'Update' }).click();
        const updatedRow = page.locator('tbody tr').filter({ hasText: 'Herman Abdul' });
        await expect(updatedRow).toBeVisible();
        await expect(updatedRow).toContainText('Quality Assurance');
        await expect(updatedRow).toContainText('$9,000,000');
        await expect(updatedRow).toContainText('6/4/2020');
    });

    test('QX-25: Cancel Add Employee', async ({ page }) => {

        // 1. Navigasi langsung ke halaman Employee (karena /auth biasanya untuk login)
        await page.goto('https://qa-sandbox-deploy.vercel.app/employees');

        // 2. Buka Modal
        await page.getByRole('button', { name: 'Add Employee' }).click();
        await page.locator('#emp-first-name').fill('Irfan');
        await page.locator('#emp-last-name').fill('Hakim');
        await page.locator('#emp-position').fill('Manager');
        await page.locator('#emp-salary').fill('200000');
        await page.locator('#emp-hire-date').fill('2000-03-03');

        // 4. Aksi Pembatalan
        await page.getByRole('button', { name: 'Cancel' }).click();
        // Pastikan form/modal tertutup dan nama "Irfan Hakim" TIDAK ada di tabel
        await expect(page.locator('#emp-first-name')).not.toBeVisible();
        await expect(page.locator('tbody')).not.toContainText('Irfan Hakim');

    })

    test('QX-24: Delete Employee', async ({ page }) => {
        await page.goto('https://qa-sandbox-deploy.vercel.app/employees');
        const targetRow = page.locator('tbody tr').filter({ hasText: 'Herman Abdul' });
        await expect(targetRow).toBeVisible();
        await targetRow.locator('.text-rose-600').click();
        await page.getByRole('button', { name: 'Yes' }).click();
        await expect(targetRow).not.toBeVisible();
        await expect(page.locator('tbody')).not.toContainText('Herman Abdul');
    });

});



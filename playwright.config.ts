import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Jalankan tes secara paralel agar cepat */
  fullyParallel: true,
  /* Gagal otomatis jika ada 'test.only' yang tertinggal di kode saat push ke GitHub */
  forbidOnly: !!process.env.CI,
  /* Retry 2 kali di GitHub Actions jika ada test yang 'flaky' (kadang gagal kadang berhasil) */
  retries: process.env.CI ? 2 : 0,
  /* Batasi worker di GitHub Actions untuk menjaga kestabilan */
  workers: process.env.CI ? 1 : undefined,

  /* KONFIGURASI REPORTER: Menghasilkan laporan HTML dan XML (JUnit) */
  reporter: [
    ['html'], 
    ['junit', { outputFile: 'results.xml' }] // File ini WAJIB untuk diimport ke Jira Xray
  ],

  /* Pengaturan global untuk setiap test */
  use: {
    /* Base URL aplikasi Anda (opsional, memudahkan saat menulis kodingan) */
    // baseURL: 'http://localhost:5173',

    /* Rekam jejak (trace) saat test gagal agar mudah di-debug */
    //trace: 'on-first-retry',
    trace: 'on',
    /* Ambil screenshot otomatis hanya jika test gagal */
    screenshot: 'only-on-failure',
    /* Rekam video hanya jika test gagal */
    video: 'on',
  },

  /* Pilih browser yang ingin dijalankan */
  projects: [
    // TAHAP 1: Menjalankan Negative Case (Testing sebelum login sukses)
    {
      name: 'negative-login',
      testMatch: /auth_negatif_case\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // TAHAP 2: Melakukan Login Sukses (Setelah negative case selesai)
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
      
    },

    // TAHAP 3: Fitur Utama (Setelah login sukses & session tersimpan)
    {
      name: 'e2e-functional',
      testMatch: ['employee.spec.ts'], // File selain login
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json', 
      },
      dependencies: ['setup'], // Menunggu login sukses beres
    },
  ],
});
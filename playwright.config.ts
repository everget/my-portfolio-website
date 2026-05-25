import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

try {
    process.loadEnvFile();
} catch (err) {
    if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') {
        throw err;
    }
}

const port = process.env.VITE_DEV_PORT ?? '5173';
// Must match `base` in vite.config.ts - the dev server only serves the app under this path.
const basePath = process.env.VITE_BASE_PATH ?? '/';
const FRONTEND_URL = `http://localhost:${port}${basePath}`;
const PLAYWRIGHT_DIR = './tests/e2e';

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
    testDir: PLAYWRIGHT_DIR,
    // Folder for test artifacts such as screenshots, videos, traces, etc.
    outputDir: path.join(PLAYWRIGHT_DIR, 'test-results'),
    // Reporter to use. See https://playwright.dev/docs/test-reporters
    reporter: [['html', { outputFolder: path.join(PLAYWRIGHT_DIR, 'report') }]],

    timeout: 20 * 1000,

    // Run tests in files in parallel
    fullyParallel: true,
    // Fail the build on CI if you accidentally left test.only in the source code.
    forbidOnly: !!process.env.CI,
    // Retry on CI only
    retries: process.env.CI ? 2 : 0,
    // Opt out of parallel tests on CI.
    workers: process.env.CI ? 1 : undefined,
    // Shared settings for all projects. See https://playwright.dev/docs/api/class-testoptions.
    use: {
        // headless: true,
        baseURL: FRONTEND_URL,
        // colorScheme: 'light',
        // locale: 'en',
        // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
        trace: 'on-first-retry',
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        // Test against mobile viewports.
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        // Test against branded browsers.
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    // Run your local dev server before starting the tests
    webServer: {
        command: 'pnpm run dev',
        url: FRONTEND_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 60 * 1000,
    },
});

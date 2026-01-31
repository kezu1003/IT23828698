import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Singlish to Sinhala Translator Tests
 * IT3040 - ITPM Assignment 1
 */
export default defineConfig({
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for the application
    baseURL: 'https://www.swifttranslator.com/',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});



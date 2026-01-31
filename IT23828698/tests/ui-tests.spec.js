import { test, expect } from '@playwright/test';

// Helper function to wait for real-time translation to complete
async function waitForTranslation(page, timeout = 2000) {
  await page.waitForTimeout(timeout);
}

// Helper function to convert and read output
async function convertAndRead(page, input) {
  const textarea = page.locator('textarea[placeholder*="Singlish"]');
  await textarea.fill(input);
  await waitForTranslation(page);
  
  // Try to find output in div first, then try textarea
  let output = await page.locator('div:has-text("ස"), div[class*="output"], [data-testid*="output"]').first().textContent().catch(() => '');
  if (!output) {
    output = await page.locator('textarea').nth(1).inputValue().catch(() => '');
  }
  return output || '';
}

// Helper function to check for Sinhala characters
function hasSinhalaChars(text) {
  return /[\u0D80-\u0DF8]/.test(text);
}

test.describe('UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/');
    await page.waitForLoadState('networkidle');
  });

  test('Pos_UI_0001 - Real-time output update behavior', async ({ page }) => {
    const input = 'mama gedhara yanavaa';
    const output = await convertAndRead(page, input);
    
    // Verify Sinhala output is generated
    expect(output.length).toBeGreaterThan(0);
    // Verify output contains Sinhala characters
    expect(hasSinhalaChars(output)).toBeTruthy();
  });
});



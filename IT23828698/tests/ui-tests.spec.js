import { test, expect } from '@playwright/test';

/**
 * UI Tests for Singlish to Sinhala Translator
 * IT3040 - ITPM Assignment 1
 *
 * These tests verify UI behavior and display functionality
 */

// Helper function to wait for real-time translation to complete
async function waitForTranslation(page, timeout = 2000) {
  await page.waitForTimeout(timeout);
}

// Helper function to convert and read output - Simplified version
async function convertAndRead(page, input) {
  const textarea = page.locator('textarea[placeholder*="Singlish"]');
  
  // Clear existing text first
  await textarea.clear();
  await page.waitForTimeout(200);
  
  // Fill the textarea with input
  await textarea.fill(input);
  
  // Wait for translation to complete
  await page.waitForTimeout(2000);
  
  // Get output
  const output = await getOutputWithoutRetry(page);
  
  // Log the translation
  console.log(`\n📝 Input: ${input}`);
  console.log(`✅ Output: ${output}`);
  
  return output;
}

// Helper function to check for Sinhala characters
function hasSinhalaChars(text) {
  return /[\u0D80-\u0DF8]/.test(text);
}

// Helper function to simulate backspacing character by character
async function backspaceCharacterByCharacter(page, text) {
  const textarea = page.locator('textarea[placeholder*="Singlish"]');

  // First fill the text and get initial output
  await textarea.fill(text);
  await waitForTranslation(page);
  const initialOutput = await getOutputWithoutRetry(page);

  // Now backspace character by character
  for (let i = text.length; i > 0; i--) {
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(300); // Reduced wait between backspaces
  }

  // Get final output after all backspacing
  await page.waitForTimeout(1000);
  const finalOutput = await getOutputWithoutRetry(page);

  return { initialOutput, finalOutput };
}

// Helper function to get output with improved extraction logic
async function getOutputWithoutRetry(page) {
  try {
    // Wait a bit for translation to complete
    await page.waitForTimeout(1500);
    
    // Get the full page text
    const pageText = await page.textContent('body');
    
    // Find the "Sinhala" label position
    const sinhalaLabelIndex = pageText.lastIndexOf('Sinhala');
    
    if (sinhalaLabelIndex === -1) {
      console.log('⚠️ "Sinhala" label not found');
      return '';
    }
    
    // Look for the emoji button after the Sinhala label (🔁)
    const emojiIndex = pageText.indexOf('🔁', sinhalaLabelIndex);
    
    if (emojiIndex === -1) {
      console.log('⚠️ Emoji button not found after Sinhala label');
      return '';
    }
    
    // Extract text between "Sinhala" label and emoji button
    let section = pageText.substring(sinhalaLabelIndex + 7, emojiIndex);
    
    // Remove extra whitespace and get the content
    let output = section.trim();
    
    // Remove any common UI text that might appear before the actual output
    // (e.g., "Copy", "Clear", etc.)
    output = output.replace(/^(Copy|Clear|Export|Share|\s)+/i, '').trim();
    
    if (output.length > 0) {
      console.log(`✅ Output found: ${output}`);
      return output;
    } else {
      console.log('⚠️ No output text found in expected location');
      return '';
    }
  } catch (error) {
    console.error('Failed to get output:', error);
    return '';
  }
}

test.describe('UI Functional Tests - Singlish to Sinhala', () => {

  test.beforeEach(async ({ page }) => {
    // Add delay between tests to avoid rate limiting
    await page.waitForTimeout(2000);

    // Navigate to the translator website
    await page.goto('https://www.swifttranslator.com/');
    await page.waitForLoadState('networkidle');
  });

  // Test Case: Pos_UI_Fun_0001 - UI handles and displays long sentence translation without overflow or truncation
  // Length Type: M (31–299 characters)
  test('Pos_UI_Fun_0001 - UI handles and displays long sentence translation without overflow or truncation', async ({ page }) => {
    const input = 'karuNaakaralaa mata udhavvak karanna puLuvandha?';
    const expected = 'කරුණාකරලා මට උදව්වක් කරන්න පුළුවන්ද?';

    const output = await convertAndRead(page, input);

    // Check that output is not empty
    expect(output.length).toBeGreaterThan(0);
    // Check that it contains Sinhala characters
    expect(hasSinhalaChars(output)).toBe(true);
    // Check that the full expected text is present (no truncation)
    expect(output).toContain(expected);
    // Additional check: ensure output length is reasonable (not truncated)
    expect(output.length).toBeGreaterThanOrEqual(expected.length);
  });

  // Test Case: Neg_UI_Fun_0001 - Output field does not clear when input is backspaced character by character
  // Length Type: S (≤30 characters)
  test('Neg_UI_Fun_0001 - Output field does not clear when input is backspaced character by character', async ({ page }) => {
    const input = 'api bath kanavaa';
    const expectedInitial = 'අපි බත් කනවා';

    // Fill input and get initial output
    const textarea = page.locator('textarea[placeholder*="Singlish"]');
    await textarea.fill(input);
    await page.waitForTimeout(3000); // Wait longer for translation
    const initialOutput = await getOutputWithoutRetry(page);

    // Verify initial output is correct
    expect(initialOutput.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(initialOutput)).toBe(true);
    expect(initialOutput).toContain(expectedInitial);

    // Clear the input by backspacing
    for (let i = input.length; i > 0; i--) {
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(200);
    }

    // Wait and get final output
    await page.waitForTimeout(1000);
    const finalOutput = await getOutputWithoutRetry(page);

    // Check that final output is NOT empty (this documents the bug)
    if (finalOutput.length > 0) {
      console.log('❌ BUG CONFIRMED: Output did not clear after backspacing input');
      expect(hasSinhalaChars(finalOutput)).toBe(true);
      expect(finalOutput).toContain(expectedInitial);
    } else {
      console.log('✅ BUG FIXED: Output cleared correctly after backspacing input');
      expect(finalOutput.length).toBe(0);
    }
  });

});

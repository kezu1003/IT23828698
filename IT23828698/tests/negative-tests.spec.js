import { test, expect } from '@playwright/test';

/**
 * Negative Functional Tests for Singlish to Sinhala Translator
 * IT3040 - ITPM Assignment 1
 * 
 * These tests verify scenarios where the translator fails or behaves incorrectly
 * Based on negative test cases from the Excel file
 */

// Helper function to wait for real-time translation to complete
async function waitForTranslation(page, timeout = 4000) {
  await page.waitForTimeout(timeout);
}

// Helper function to convert and read output
async function convertAndRead(page, input) {
  const textarea = page.locator('textarea[placeholder*="Singlish"]');
  
  // Clear existing text first to ensure fresh translation
  await textarea.clear();
  await page.waitForTimeout(500);
  
  await textarea.fill(input);
  await waitForTranslation(page);

  //Get the text content specifically from the output area using a more precise selector
  let output = '';
  let retries = 8; // Increased retries for reliability
  
  while (retries > 0 && output.length === 0) {
    try {
      // Wait for output to appear - look for element containing Sinhala text after the label
      await page.waitForTimeout(3000); // Increased wait time
      
      // Get all text content from the page
      const pageText = await page.textContent('body');
      
      // Find "Sinhala" label and extract text after it until the translate button emoji
      const sinhalaIndex = pageText.lastIndexOf('Sinhala');
      const emojiIndex = pageText.indexOf('🔁', sinhalaIndex);
      
      if (sinhalaIndex !== -1 && emojiIndex !== -1) {
        // Extract the section between "Sinhala" and the emoji
        let section = pageText.substring(sinhalaIndex + 7, emojiIndex);
        
        // Find where the actual Sinhala text starts (first Sinhala Unicode character)
        const sinhalaMatch = section.match(/[\u0D80-\u0DFF]/);
        if (sinhalaMatch) {
          const startPos = section.indexOf(sinhalaMatch[0]);
          output = section.substring(startPos).trim();
        } else {
          // If no Sinhala characters found, try to extract after any visible content markers
          // Remove common UI elements and get the remaining text
          section = section.replace(/[\s\n]+/g, ' ').trim();
          if (section.length > 0) {
            output = section;
          }
        }
      }
    } catch (error) {
      console.error('Failed to get output:', error);
    }
    
    if (output.length === 0) {
      retries--;
      if (retries > 0) {
        console.log('Output not found, retrying...');
        await page.waitForTimeout(3000); // Increased wait before retry
      }
    }
  }
  
  // Log the translation
  console.log(`\n📝 Input: ${input}`);
  console.log(`✅ Output: ${output}`);
  
  return output;
}

// Helper function to check for Sinhala characters
function hasSinhalaChars(text) {
  return /[\u0D80-\u0DF8]/.test(text);
}

test.describe('Negative Functional Tests - Singlish to Sinhala', () => {
  
  test.beforeEach(async ({ page }) => {
    // Add delay between tests to avoid rate limiting
    await page.waitForTimeout(2000);
    
    // Navigate to the translator website
    await page.goto('https://www.swifttranslator.com/');
    await page.waitForLoadState('networkidle');
  });

  // Test Case: Neg_Fun_0001 - Incorrect transliteration of email addresses / identifiers
  // Length Type: S (≤30 characters)
  test('Neg_Fun_0001 - Incorrect transliteration of email addresses / identifiers', async ({ page }) => {
    const input = 'keshani2001karunarathne@gmail.com';
    const expected = 'keshani2001karunarathne@gmail.com';
    const actualExpected = 'කෙශනි2001කරුනරත්නෙ@gmail.com';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system incorrectly transliterates email address
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0002 - Incorrect conversion of multi-vowel word
  // Length Type: M (31–299 characters)
  test('Neg_Fun_0002 - Incorrect conversion of multi-vowel word', async ({ page }) => {
    const input = 'siya gaetalu visaDHAiima saDHAhaa rajayata labaadhun paeya 48ka kaalaya avasan vii aetha.';
    const expected = 'සිය ගැටලු විසඳීම සඳහා රජයට ලබාදුන් පැය 48ක කාලය අවසන් වී ඇත.';
    const actualExpected = 'සිය ගැටලු විසඳෛඉම සඳහා රජයට ලබාදුන් පැය 48ක කාලය අවසන් වී ඇත.';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system incorrectly converts multi-vowel word
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0003 - Incorrect vowel-consonant mapping in complex words
  // Length Type: L (≥300 characters)
  test('Neg_Fun_0003 - Incorrect vowel-consonant mapping in complex words', async ({ page }) => {
    const input = 'gigurum sahitha vaesi samaga aethiviya haeki thaavakaalika thadha suLQQ valin saha akuNu maGAain sidhu vana anathuru avama kara gaeniimata avashYA piyavara gannaa lesa kaalaguNa vidhYaa dhepaarthameenthuva janathaavagen kaaruNikava illaa sitinavaa.';
    const expected = 'ගිගුරුම් සහිත වැසි සමග ඇතිවිය හැකි තාවකාලික තද සුළං වලින් සහ අකුණු මඟින් සිදු වන අනතුරු අවම කර ගැනීමට අවශ්‍ය පියවර ගන්නා ලෙස කාලගුණ විද්‍යා දෙපාර්තමේන්තුව ජනතාවගෙන් කාරුණිකව ඉල්ලා සිටිනවා.';
    const actualExpected = 'ගිගුරුම් සහිත වැසි සමග ඇතිවිය හැකි තාවකාලික තද සුළං වලින් සහ අකුණු මඟාඉන් සිදු වන අනතුරු අවම කර ගැනීමට අවශ්‍ය පියවර ගන්නා ලෙස කාලගුණ විද්‍යා දෙපාර්තමේන්තුව ජනතාවගෙන් කාරුණිකව ඉල්ලා සිටිනවා.';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system incorrectly maps vowel-consonant in complex words
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0004 - Incorrect transliteration of the "Sha" (ෂ) character
  // Length Type: L (≥300 characters)
  test('Neg_Fun_0004 - Incorrect transliteration of the "Sha" (ෂ) character', async ({ page }) => {
    const input = 'tharaga aaramBhaya saDHAhaa varshaaven baaDhaa ellaviima heethuven kaasiyee vaasiya pramaadha vuu athara pandhuvaara 17 ka tharagayak lesa tharagaya paevaethviimata niyamithayi.';
    const expected = 'තරග ආරම්භය සඳහා වර්ෂාවෙන් බාධා එල්ලවීම හේතුවෙන් කාසියේ වාසිය ප්‍රමාද වූ අතර පන්දුවාර 17 ක තරගයක් ලෙස තරගය පැවැත්වීමට නියමිතයි.';
    const actualExpected = 'තරග ආරම්භය සඳහා වර්ශාවෙන් බාධා එල්ලවීම හේතුවෙන් කාසියේ වාසිය ප්‍රමාද වූ අතර පන්දුවාර 17 ක තරගයක් ලෙස තරගය පැවැත්වීමට නියමිතයි.';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system incorrectly transliterates "Sha" character
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0005 - Failure to convert short English words and complex nasal vowels
  // Length Type: S (≤30 characters)
  test('Neg_Fun_0005 - Failure to convert short English words and complex nasal vowels', async ({ page }) => {
    const input = 'lak vijaya balaagaaraya, norochchoole gal aGAuru balaagaaraya lesadha haDHAunvayi.';
    const expected = 'ලක් විජය බලාගාරය, නොරොච්චෝලෙ ගල් අඟුරු බලාගාරය ලෙසද හඳුන්වයි.';
    const actualExpected = 'ලක් විජය බලාගාරය, නොරොච්චෝලෙ gal අඟෞරු බලාගාරය ලෙසද හඳෞන්වයි.';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system fails to convert short English words and complex nasal vowels
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0006 - Failure to convert capital letter consonant medials (Yansaya)
  // Length Type: S (≤30 characters)
  test('Neg_Fun_0006 - Failure to convert capital letter consonant medials (Yansaya)', async ({ page }) => {
    const input = 'aachaarYA nimal silvaa dheashanayak pavathvanavaa.';
    const expected = 'ආචාර්ය නිමල් සිල්වා දේශනයක් පවත්වනවා.';
    const actualExpected = 'ආචාරYඅ නිමල් සිල්වා දේශනයක් පවත්වනවා.';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system fails to convert capital letter consonant medials
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0007 - Failure to transliterate or preserve brand names
  // Length Type: S (≤30 characters)
  test('Neg_Fun_0007 - Failure to transliterate or preserve brand names', async ({ page }) => {
    const input = 'dharuvan dijital aDhYaapanayata yomu kiriima huawei samaagama illaa aetha.';
    const expected = 'දරුවන් ඩිජිටල් අධ්‍යාපනයට යොමු කිරීම Huawei සමාගම ඉල්ලා ඇත.';
    const actualExpected = 'දරුවන් ඩිජිටල් අධ්‍යාපනයට යොමු කිරීම හුඅwඑඉ සමාගම ඉල්ලා ඇත.';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system fails to preserve brand names correctly
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0008 - Failure to map Sanskrit-delivered vowel
  // Length Type: S (≤30 characters)
  test('Neg_Fun_0008 - Failure to map Sanskrit-delivered vowel', async ({ page }) => {
    const input = 'rishivarayaa edhina kutiyea sitiyea naetha.';
    const expected = 'ඍෂිවරයා එදින කුටියේ සිටියේ නැත.';
    const actualExpected = 'රිශිවරයා එදින කුටියේ සිටියේ නැත.';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system fails to map Sanskrit-derived vowel
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0009 - Failure in Aspirated Consonants and Rakaraansaya joining
  // Length Type: M (31–299 characters)
  test('Neg_Fun_0009 - Failure in Aspirated Consonants and Rakaraansaya joining', async ({ page }) => {
    const input = 'ministhara mahaththayaa paarlimeenthuva thula bhaasha prayoogaya kiriimeedhi aadhareesha keriima heethuven vivaadha  paevaethviimata puradhugaami viya.';
    const expected = 'මිනිස්තර මහත්තයා පාර්ලිමේන්තුව තුල භාෂා ප්‍රයෝගය කිරීමේදි ආදර්ශ කිරීම හේතුවෙන් විවාද  පැවැත්වීමට පුරදුගාමි විය.';
    const actualExpected = 'මිනිස්තර මහත්තයා පාර්ලිමේන්තුව තුල බ්හාශ ප්‍රයෝගය කිරීමේදි ආදරේශ කෙරීම හේතුවෙන් විවාද  පැවැත්වීමට පුරදුගාමි විය.';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system fails with aspirated consonants and Rakaraansaya
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

  // Test Case: Neg_Fun_0010 - English brand terms in Singlish, medium (with errors)
  // Length Type: S (≤30 characters)
  test('Neg_Fun_0010 - English brand terms in Singlish, medium (with errors)', async ({ page }) => {
    const input = 'Apple Store eken navathama iPhone eka gaththaa';
    const expected = 'Apple Store එකෙන් නවතම iphone එක ගත්තා';
    const actualExpected = 'Apple Store එකෙන් නවතම ඉඵ්හොනෙ එක ගත්තා';
    const output = await convertAndRead(page, input);
    
    // Test should fail - system incorrectly transliterates iPhone
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe(expected);
  });

});




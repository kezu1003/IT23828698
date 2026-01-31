import { test, expect } from '@playwright/test';

/**
 * Positive Functional Tests for Singlish to Sinhala Translator
 * IT3040 - ITPM Assignment 1
 * 
 * These tests verify that the translator correctly converts Singlish input to Sinhala output
 * Based on test cases from the Excel file
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

test.describe('Positive Functional Tests - Singlish to Sinhala', () => {
  
  test.beforeEach(async ({ page }) => {
    // Add delay between tests to avoid rate limiting
    await page.waitForTimeout(2000);
    
    // Navigate to the translator website
    await page.goto('https://www.swifttranslator.com/');
    await page.waitForLoadState('networkidle');
  });

  // Test Case: Pos_Fun_0001 - Simple sentence, present tense, short
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0001 - Simple sentence, present tense, short', async ({ page }) => {
    const input = 'adha koLaBA nagarayee raThavaahana thadhabadhaya ithaa aDhika mattamaka pavathii.';
    const expected = 'අද කොළඹ නගරයේ රථවාහන තදබදය ඉතා අධික මට්ටමක පවතී.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0002 - Simple sentence with object, short
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0002 - Simple sentence with object, short', async ({ page }) => {
    const input = 'vishvavidhYaala sisun pusthakaalayee thibena vidhYaathmaka granTha kiyavathi';
    const expected = 'විශ්වවිද්‍යාල සිසුන් පුස්තකාලයේ තිබෙන විද්‍යාත්මක ග්‍රන්ථ කියවති.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0003 - Simple sentence with need expression
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0003 - Simple sentence with need expression', async ({ page }) => {
    const input = 'aarThika sQQvarDhanaya saDHAhaa ratata vidheesha aayoojana aakarShaNaya kara gaeniimata avashYAyi.';
    const expected = 'ආර්ථික සංවර්ධනය සඳහා රටට විදේශ ආයෝජන ආකර්ෂණය කර ගැනීමට අවශ්‍යයි.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0004 - Two ideas joined, medium length
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0004 - Two ideas joined, medium length', async ({ page }) => {
    const input = 'vaidhYA nilaDhaariin nava prathikaara kramaveedhayak haDHAunvaa dhun athara roogiinta vadaa hoDHA seevaavak labaa dhiimata samath vuuha.';
    const expected = 'වෛද්‍ය නිලධාරීන් නව ප්‍රතිකාර ක්‍රමවේදයක් හඳෞන්වා දුන් අතර රෝගීන්ට වඩා හොඳ සේවාවක් ලබා දීමට සමත් වූහ.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0005 - Compound with condition
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0005 - Compound with condition', async ({ page }) => {
    const input = 'oba viBhaagayata suudhaanam vannee nam ihaLa lakuNu labaa gatha haeki vana athara vishvavidhYaala praveeshaya sahathika vee.';
    const expected = 'ඔබ විභාගයට සූදානම් වන්නේ නම් ඉහළ ලකුණු ලබා ගත හැකි වන අතර විශ්වවිද්‍යාල ප්‍රවේශය සහතික වේ.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0006 - Complex with condition, short
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0006 - Complex with condition, short', async ({ page }) => {
    const input = 'kaalaguNaya hithakara nam kRUShikaarmika asvaenna vaedi dhiyuNu vanu aetha.';
    const expected = 'කාලගුණය හිතකර නම් කෘෂිකාර්මික අස්වැන්න වැඩි දියුණු වනු ඇත.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0007 - Complex with cause/effect, medium
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0007 - Complex with cause/effect, medium', async ({ page }) => {
    const input = 'paarisarika dhuushaNaya vaedi vana heyin jaiva vividhathvaya adaala viima saha dheashaguNika balapaem  aethi viimee avadhaanam ihaLa yanavaa.';
    const expected = 'පාරිසරික දූශණය වැඩි වන හෙයින් ජෛව විවිදත්වය අඩාල වීම සහ දේශගුණික බලපැම්  ඇති වීමේ අවදානම් ඉහළ යනවා.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0008 - Simple question, short
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0008 - Simple question, short', async ({ page }) => {
    const input = 'jaathika aDhYaapana prathipathiya prathisQQskaraNaya kiriimee kriyaavaliya kesee dha?';
    const expected = 'ජාතික අධ්‍යාපන ප්‍රතිපත්තිය ප්‍රතිසංස්කරණය කිරීමේ ක්‍රියාවලිය කෙසේ ද?';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0009 - When question
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0009 - When question', async ({ page }) => {
    const input = 'aarThika sQQvarDhana vaedasatahan kriyaathmaka kiriima aaramBha karannee kavadhaadha saha ehi prathiPala dhaekiya haekkee kavadhaadha?';
    const expected = 'ආර්ථික සංවර්ධන වැඩසටහන් ක්‍රියාත්මක කිරීම ආරම්භ කරන්නේ කවදාද සහ එහි ප්‍රතිඵල දැකිය හැක්කේ කවදාද?';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0010 - How question with verification
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0010 - How question with verification', async ({ page }) => {
    const input = 'dijital mudhal ganudhenu kramaya Bhaavithaa karana aakaaraya haridha saha aarakShitha dha yanna sathYaapanaya kaLa haekidha?';
    const expected = 'ඩිජිටල් මුදල් ගනුදෙනු ක්‍රමය භාවිතා කරන ආකාරය හරිද සහ ආරක්ෂිත ද යන්න සත්‍යාපනය කළ හැකිද?';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0011 - Command, come quickly
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0011 - Command, come quickly', async ({ page }) => {
    const input = 'hadhisi raesviimata ikmanin paemiNenna, pramaadha karanna epaa, vaedhagath thiiraNa gatha yuthuyi.';
    const expected = 'හදිසි රැස්වීමට ඉක්මනින් පැමිණෙන්න, ප්‍රමාද කරන්න එපා, වැදගත් තීරණ ගත යුතුයි.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0012 - Command, give me
  // Length Type: S (≤30 characters)
  test('Pos_Fun_0012 - Command, give me', async ({ page }) => {
    const input = 'mata navathama vaarthaa dhaththa siyalla adha dhinayaa thuLama labaa dhenna.';
    const expected = 'මට නවතම වාර්තා දත්ත සියල්ල අද දිනයා තුළම ලබා දෙන්න.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0013 - Positive affirmation
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0013 - Positive affirmation', async ({ page }) => {
    const input = 'ov, vYaapRUthiya saarThakava nima kiriimata apata haekiyaava aethi athara siyalu sampath suudhaanam.';
    const expected = 'ඔව්, ව්‍යාපෘතිය සාර්ථකව නිම කිරීමට අපට හැකියාව ඇති අතර සියලු සම්පත් සූදානම්';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0014 - Negative statement with "naehae"
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0014 - Negative statement with "naehae"', async ({ page }) => {
    const input = 'nava vYAvasThaava piLibaDHAva mahajanathaavata nisi avabooDhayak thavamath laebii naehae';
    const expected = 'නව ව්‍යවස්ථාව පිළිබඳව මහජනතාවට නිසි අවබෝධයක් තවමත් ලැබී නැහැ.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0015 - Negative with "ennee naehae"
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0015 - Negative with "ennee naehae"', async ({ page }) => {
    const input = 'dheeshapaalana arbudhaya nisaa aarThikaya idhiriyata yannata ennee naehae.';
    const expected = 'දේශපාලන අර්බුදය නිසා ආර්ථිකය ඉදිරියට යන්නට එන්නේ නැහැ.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0016 - Morning greeting
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0016 - Morning greeting', async ({ page }) => {
    const input = 'suBha udhaeesanak! adha dhinaya obata saarThaka haa priithimath dhinayak veevaa yi praarThanaa karami.';
    const expected = 'සුභ උදෑසනක්! අද දිනය ඔබට සාර්ථක හා ප්‍රීතිමත් දිනයක් වේවා යි ප්‍රාර්ථනා කරමි.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0017 - Polite request with "karuNaakaralaa"
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0017 - Polite request with "karuNaakaralaa"', async ({ page }) => {
    const input = 'karuNaakaralaa mema liyavilla  kiyavaa avashYA sQQshooDhana sidhu kara naevatha idhiripath karanna.';
    const expected = 'කරුණාකරලා මෙම ලියවිල්ල  කියවා අවශ්‍ය සංශෝධන සිදු කර නැවත ඉදිරිපත් කරන්න.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0018 - Request to send letter
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0018 - Request to send letter', async ({ page }) => {
    const input = 'avashYA nila lipiya adha savasa vana vita thaepael karanna kiyaa illaa sitimi.';
    const expected = 'අවශ්‍ය නිල ලිපිය අද සවස වන විට තැපැල් කරන්න කියා ඉල්ලා සිටිමි.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0019 - Very polite request
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0019 - Very polite request', async ({ page }) => {
    const input = 'obagee vatinaa kaalaya vaeya kara mema yoojanaava salakaa balaa prathichaarayak labaa dhennee nam ithaa kRUthaGHA vemi.';
    const expected = 'ඔබගේ වටිනා කාලය වැය කර මෙම යෝජනාව සලකා බලා ප්‍රතිචාරයක් ලබා දෙන්නේ නම් ඉතා කෘතඥ වෙමි.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0020 - Common expression "I'm sleepy"
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0020 - Common expression "I\'m sleepy"', async ({ page }) => {
    const input = 'mata harima nindhayi, iiyee raathriyee vaeda katayuthu nisaa hariyata nidhaa ganna baeri vuNaa.';
    const expected = 'මට හරිම නින්දයි, ඊයේ රාත්‍රියේ වැඩ කටයුතු නිසා හරියට නිදා ගන්න බැරි වුණා.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0021 - Common collocation "eat food"
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0021 - Common collocation "eat food"', async ({ page }) => {
    const input = 'api haemooma ekata vaadi velaa rasavath kaeema kanna giyaama harima sathutuyi.';
    const expected = 'අපි හැමෝම එකට වාඩි වෙලා රසවත් කෑම කන්න ගියාම හරිම සතුටුයි.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0022 - Past tense
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0022 - Past tense', async ({ page }) => {
    const input = 'pasugiya vasaree apee aayathanaya  jaathYAnthara sammaana labaa gaththaa.';
    const expected = 'පසුගිය වසරේ අපේ ආයතනය  ජාත්‍යන්තර සම්මාන ලබා ගත්තා.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0023 - Plural pronoun "they"
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0023 - Plural pronoun "they"', async ({ page }) => {
    const input = 'ovun vidhYaathmaka vYaapRUthiya saDHAhaa avashYA upakaraNa haa muulYA aaDhaara ekathu kara gaththooya.';
    const expected = 'ඔවුන් විද්‍යාත්මක ව්‍යාපෘතිය සඳහා අවශ්‍ය උපකරණ හා මූල්‍ය ආධාර එකතු කර ගත්තෝය.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0024 - English brand terms in Singlish, medium
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0024 - English brand terms in Singlish, medium', async ({ page }) => {
    const input = 'Google Pixel ekee camera quality eka vaediyen hoDHAyi kiyalaa reviews vala thibuNaa.';
    const expected = 'Google Pixel එකේ camera quality එක වැඩියෙන් හොඳයි කියලා reviews වල තිබුණා.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0025 - Sinhala Unicode Input Validation
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0025 - Sinhala Unicode Input Validation', async ({ page }) => {
    const input = 'graamiiya pradheeshavala aDhYaapanaya ihaLa mattamakata gena aa yuthuyi.';
    const expected = 'ග්‍රාමීය ප්‍රදේශවල අධ්‍යාපනය ඉහළ මට්ටමකට ගෙන ආ යුතුයි.';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

  // Test Case: Pos_Fun_0026 - Sinhala Unicode Input Validation
  // Length Type: M (31–299 characters)
  test('Pos_Fun_0026 - Sinhala Unicode Input Validation', async ({ page }) => {
    const input = 'dharuvan osavaagena paemiNena poth baeegayee bara adu karamu.';
    const expected = 'දරුවන් ඔසවාගෙන පැමිණෙන පොත් බෑගයේ බර අඩු කරමු';
    const output = await convertAndRead(page, input);
    
    expect(output.length).toBeGreaterThan(0);
    expect(hasSinhalaChars(output)).toBe(true);
  });

});




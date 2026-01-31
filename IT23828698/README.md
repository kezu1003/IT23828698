# Singlish to Sinhala Translator - Automated Test Suite

**IT3040 - ITPM Assignment 1**  
**Automated Testing Using Playwright**

This repository contains automated test cases for the Singlish to Sinhala translator available at [https://www.swifttranslator.com/](https://www.swifttranslator.com/)

---

## 📋 Test Coverage

This test suite includes **34 test cases** covering:

### Positive Functional Tests (23 tests)
- ✅ Simple, compound, and complex sentences
- ✅ Interrogative (questions) and imperative (commands) forms
- ✅ Positive and negative sentence forms
- ✅ Daily language usage and common expressions
- ✅ Greetings, requests, and responses
- ✅ Polite vs informal phrasing
- ✅ Tense variations (past, present, future)
- ✅ Pronoun variations and plural forms
- ✅ Mixed language content (Singlish + English)

### Negative Functional Tests (10 tests)
- ❌ Joined words without spaces
- ❌ Excessive punctuation
- ❌ Multiple consecutive spaces
- ❌ Inconsistent capitalization
- ❌ Incomplete sentences
- ❌ Numbers without context
- ❌ Special characters
- ❌ Extremely long concatenated words
- ❌ Whitespace-only input

### UI Tests (1+ tests)
- 🖥️ Real-time output update behavior
- 🖥️ Clear input/output functionality

---

## 🚀 Prerequisites

Before running the tests, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

---

## 📦 Installation Steps

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd singlish-translator-tests
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- Playwright Test framework
- Chromium browser (for running tests)

### Step 3: Install Playwright Browsers
```bash
npx playwright install
```

---

## 🧪 Running the Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Run Tests with UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Specific Test File
```bash
# Run only positive tests
npx playwright test tests/positive-tests.spec.js

# Run only negative tests
npx playwright test tests/negative-tests.spec.js

# Run only UI tests
npx playwright test tests/ui-tests.spec.js
```

### Run Specific Test Case
```bash
npx playwright test --grep "Pos_Fun_0002"
```

---

## 📊 Viewing Test Reports

After running tests, view the HTML report:

```bash
npm run report
```

This opens an interactive HTML report showing:
- ✅ Passed tests
- ❌ Failed tests
- 📸 Screenshots (on failure)
- 🎬 Videos (on failure)
- 📋 Detailed logs

---

## 📁 Project Structure

```
singlish-translator-tests/
│
├── tests/
│   ├── positive-tests.spec.js   # 23 positive functional test cases
│   ├── negative-tests.spec.js   # 10 negative functional test cases
│   └── ui-tests.spec.js          # UI test cases
│
├── playwright.config.js          # Playwright configuration
├── package.json                  # Project dependencies and scripts
├── README.md                     # This file
│
└── playwright-report/            # Test reports (generated after running tests)
```

---

## 🔧 Configuration

### Browser Configuration
By default, tests run on **Chromium**. To add more browsers, edit `playwright.config.js`:

```javascript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
],
```

### Timeout Configuration
Default timeout is **30 seconds** per test. Adjust in `playwright.config.js`:

```javascript
timeout: 30 * 1000, // 30 seconds
```

---

## 🐛 Troubleshooting

### Issue: Tests fail with "Timeout" error
**Solution:** Increase timeout in test or config file
```javascript
test.setTimeout(60000); // 60 seconds
```

### Issue: Cannot find selector
**Solution:** Update selectors in test files based on actual website structure
```javascript
const SELECTORS = {
  singlishInput: 'textarea[placeholder*="Singlish"]', // Update this
  sinhalaOutput: 'textarea[placeholder*="Sinhala"]',  // Update this
};
```

### Issue: Playwright browsers not installed
**Solution:** Run browser installation
```bash
npx playwright install
```

### Issue: Network error or site not loading
**Solution:** Check internet connection and verify website is accessible

---

## 📝 Test Case Details

### Test Case Naming Convention
- **Pos_Fun_XXXX**: Positive Functional Tests
- **Neg_Fun_XXXX**: Negative Functional Tests
- **Pos_UI_XXXX**: Positive UI Tests
- **Neg_UI_XXXX**: Negative UI Tests

### Expected vs Actual Output
Each test:
1. Enters Singlish input
2. Waits for real-time translation
3. Captures Sinhala output
4. Compares with expected output
5. Logs results (Pass/Fail)

---

## 📄 Test Results Documentation

Test execution results are documented in:
- **Excel File**: `Assignment_1_keshi.xlsx`
- **HTML Report**: Generated after test execution
- **Console Output**: Real-time logs during test execution

---

## 🔗 Important Links

- **Website Under Test**: https://www.swifttranslator.com/
- **Playwright Documentation**: https://playwright.dev/
- **Assignment Document**: Refer to assignment PDF

---

## 👤 Author

**Your Name**  
**Registration Number**: [Your Registration Number]  
**Course**: IT3040 - ITPM  
**Assignment**: Assignment 1 - Testing & Automation

---

## 📅 Submission Details

**Submission Date**: 1st February 2026  
**Repository**: This Git repository (must be publicly accessible)

---

## ⚠️ Important Notes

1. **Selectors May Need Adjustment**: The test files use generic selectors. You may need to update them based on the actual website structure.

2. **Expected Outputs**: Verify expected Sinhala outputs match the application's Help page character combinations.

3. **Network Dependency**: Tests require internet connection to access the website.

4. **Real-time Translation**: Tests assume the website updates Sinhala output automatically without a "Translate" button.

5. **Browser Compatibility**: Tests are configured for Chromium by default. Add other browsers in config if needed.

---

## 🎯 Next Steps After Setup

1. ✅ Install all dependencies
2. ✅ Run tests once to verify setup
3. ✅ Update selectors if needed
4. ✅ Review and verify expected outputs
5. ✅ Execute full test suite
6. ✅ Document results in Excel file
7. ✅ Generate HTML report
8. ✅ Commit and push to Git
9. ✅ Verify repository is publicly accessible
10. ✅ Submit before deadline

---

## 📧 Support

If you encounter any issues, please check:
1. Node.js and npm are properly installed
2. All dependencies are installed (`npm install`)
3. Playwright browsers are installed (`npx playwright install`)
4. Internet connection is active
5. Website https://www.swifttranslator.com/ is accessible

---

**Good luck with your testing! 🚀**




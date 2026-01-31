# 📝 Complete Step-by-Step Guide for Assignment Completion

## ✅ What You Have Done So Far
1. ✅ Created 33 test cases in Excel
2. ✅ Filled in Test IDs, Test Names, Input Length, and Input values
3. ❌ **Missing**: Actual Output, Status, Justification, Coverage columns
4. ❌ **Missing**: 1 UI test case

---

## 🎯 What You Need to Do Next

### **PHASE 1: Complete Your Excel File** (Do this FIRST)

#### Step 1: Add the Missing UI Test Case to Excel
Add this as **Pos_UI_0001** in your Excel:

| Column | Value |
|--------|-------|
| TC ID | Pos_UI_0001 |
| Test case name | Sinhala output updates automatically in real-time |
| Input length type | S |
| Input | mama gedhara yanavaa |
| Expected output | Sinhala output should update automatically while typing and display: මම ගෙදර යනවා |
| Actual output | *(You'll fill this after testing)* |
| Status | *(You'll fill this after testing)* |
| Accuracy justification | • Sinhala output appears in real-time conversion<br>• Output updates correctly as the user types<br>• No UI lag or freezing observed |
| What is covered by the test | • Usability flow (real-time conversion)<br>• Simple sentence<br>• S (≤30 characters)<br>• Real-time output update behavior |

#### Step 2: Test Each Input Manually on the Website
1. Go to https://www.swifttranslator.com/
2. For EACH test case in your Excel:
   - Type the **Input** in the Singlish field
   - Wait for the translation
   - Copy the **Actual Output** from the Sinhala field
   - Paste it in the **Actual Output** column in Excel
   - Compare with **Expected Output**:
     - If they match → **Status = "Pass"**
     - If they don't match → **Status = "Fail"**

#### Step 3: Fill Justification Column
For **Positive tests** that PASS:
```
• The [greeting/sentence/request] meaning is preserved.
• Sinhala spelling and punctuation are correct.
• The [question mark/punctuation] remains correctly placed.
```

For **Negative tests**:
```
• System unable to convert properly OR incorrect output
• Issue: [Describe what went wrong]
  Example: "Joined words without spaces cause conversion failure"
```

#### Step 4: Fill Coverage Column
Use this format (4 bullet points):
```
• [Input Type/Domain]
• [Sentence/Grammar Focus]
• [Input Length Type]
• [Quality Focus]
```

Example:
```
• Daily language usage
• Simple sentence
• S (≤30 characters)
• Accuracy validation
```

Refer to the assignment document pages 14-16 for allowed values!

---

### **PHASE 2: Set Up Playwright on Your Computer**

#### Step 1: Install Node.js
1. Download from: https://nodejs.org/ (LTS version)
2. Run the installer
3. Verify: Open **Command Prompt** or **Terminal**
   ```bash
   node --version
   npm --version
   ```

#### Step 2: Download the Project Files
1. Download the `singlish-translator-tests` folder from this session
2. Save it to your computer (e.g., `C:\Projects\singlish-translator-tests`)

#### Step 3: Install Dependencies
Open Command Prompt/Terminal in the project folder:
```bash
cd C:\Projects\singlish-translator-tests
npm install
```

Wait for installation to complete.

#### Step 4: Install Playwright Browsers
```bash
npx playwright install
```

This downloads Chromium browser for testing.

---

### **PHASE 3: Update Selectors in Test Files**

#### Step 1: Inspect the Website
1. Open https://www.swifttranslator.com/ in Chrome
2. Right-click on the **Singlish input box** → Click "Inspect"
3. Find the HTML element (e.g., `<textarea id="singlish-input">`)
4. Note the ID, class, or placeholder

#### Step 2: Find the Correct Selectors
Repeat for the **Sinhala output box**.

Common patterns:
- `#singlish-input` (if it has ID)
- `textarea[placeholder="Type Singlish"]` (if it has placeholder)
- `textarea:nth-of-type(1)` (first textarea)
- `textarea:nth-of-type(2)` (second textarea)

#### Step 3: Update Test Files
Open these files in a text editor (VS Code, Notepad++, etc.):
- `tests/positive-tests.spec.js`
- `tests/negative-tests.spec.js`
- `tests/ui-tests.spec.js`

Find this section at the top:
```javascript
const SELECTORS = {
  singlishInput: 'textarea',           // ✏️ UPDATE THIS
  sinhalaOutput: 'textarea:nth-of-type(2)', // ✏️ UPDATE THIS
};
```

Replace with your actual selectors!

**OR** use Playwright Codegen:
```bash
npx playwright codegen https://www.swifttranslator.com/
```
Click on elements to see their selectors!

---

### **PHASE 4: Run the Tests**

#### Step 1: Run All Tests
```bash
npm test
```

This will:
- Run all 34 tests
- Generate HTML report
- Show pass/fail results

#### Step 2: View the Report
```bash
npm run report
```

Opens HTML report in browser with detailed results.

#### Step 3: Run Tests in Headed Mode (Watch Browser)
```bash
npm run test:headed
```

You can SEE the browser testing in real-time!

#### Step 4: Debug Failed Tests
```bash
npm run test:debug
```

Step through tests to see what's failing.

---

### **PHASE 5: Update Excel with Automation Results**

#### Option A: Manual (If some tests fail)
1. Run tests
2. Check console output for actual results
3. Manually update Excel **Actual Output** column
4. Set **Status** (Pass/Fail)

#### Option B: Automated (Advanced)
The tests log outputs in console. You can:
1. Copy console logs
2. Parse the "Actual Output" values
3. Update Excel

---

### **PHASE 6: Set Up Git and GitHub**

#### Step 1: Create GitHub Account
Go to: https://github.com/signup

#### Step 2: Create New Repository
1. Click "+" → "New repository"
2. Name: `singlish-translator-tests`
3. ✅ Check "Public"
4. ✅ Add README (optional, you already have one)
5. Click "Create repository"

#### Step 3: Initialize Git Locally
In your project folder:
```bash
git init
git add .
git commit -m "Initial commit - Playwright test automation"
```

#### Step 4: Connect to GitHub
Copy commands from GitHub (they look like this):
```bash
git remote add origin https://github.com/YOUR_USERNAME/singlish-translator-tests.git
git branch -M main
git push -u origin main
```

#### Step 5: Verify Repository is Public
1. Go to your GitHub repo URL
2. Open in **Incognito/Private window** (logged out)
3. Can you see the files? ✅ Good!

---

### **PHASE 7: Final Submission**

#### Step 1: Create Submission Folder
```
YOUR_REGISTRATION_NUMBER/
│
├── YOUR_REGISTRATION_NUMBER.xlsx         (Your completed Excel file)
├── github_link.txt                       (GitHub repo URL)
└── (Optional: Screenshots)
```

#### Step 2: Create github_link.txt
```
GitHub Repository Link:
https://github.com/YOUR_USERNAME/singlish-translator-tests

Instructions to Run:
1. Clone the repository
2. Run: npm install
3. Run: npx playwright install
4. Run: npm test
```

#### Step 3: Zip the Folder
1. Rename your Excel to: `YOUR_REGISTRATION_NUMBER.xlsx`
2. Create folder: `YOUR_REGISTRATION_NUMBER`
3. Put Excel + github_link.txt inside
4. Right-click → Send to → Compressed (zipped) folder

#### Step 4: Submit on CourseWeb
Upload the zip file before **1st February 2026**

---

## 📋 Checklist Before Submission

### Excel File ✅
- [ ] 23 Positive Functional test cases
- [ ] 10 Negative Functional test cases
- [ ] 1 UI test case
- [ ] All **Input** columns filled
- [ ] All **Expected Output** columns filled
- [ ] All **Actual Output** columns filled (from testing)
- [ ] All **Status** columns filled (Pass/Fail)
- [ ] All **Justification** columns filled
- [ ] All **Coverage** columns filled (4 bullets each)
- [ ] File renamed to YOUR_REGISTRATION_NUMBER.xlsx

### Playwright Project ✅
- [ ] All test files created
- [ ] Selectors updated to match website
- [ ] Tests run successfully
- [ ] README.md included
- [ ] package.json included
- [ ] playwright.config.js included

### GitHub Repository ✅
- [ ] Repository created
- [ ] All files pushed
- [ ] Repository is PUBLIC
- [ ] Can access without login
- [ ] github_link.txt created with URL

### Submission Folder ✅
- [ ] Folder named YOUR_REGISTRATION_NUMBER
- [ ] Excel file inside
- [ ] github_link.txt inside
- [ ] Folder zipped
- [ ] Uploaded to CourseWeb

---

## 🆘 Common Issues & Solutions

### Issue 1: Tests fail with "Timeout"
**Solution**: Increase wait time in tests
```javascript
await waitForTranslation(page, 5000); // 5 seconds
```

### Issue 2: Cannot find element
**Solution**: Update selectors using `npx playwright codegen`

### Issue 3: Excel has plagiarism warning
**Solution**: Use YOUR OWN words in justification. Don't copy from samples!

### Issue 4: GitHub repo not accessible
**Solution**: Make sure it's set to "Public" in repo settings

### Issue 5: npm install fails
**Solution**: Run as administrator or use `--force` flag

---

## 🎯 Timeline Suggestion

**Day 1**: 
- ✅ Complete Excel manually (test all inputs on website)
- ✅ Fill all columns

**Day 2**:
- ✅ Install Node.js and Playwright
- ✅ Update selectors in test files
- ✅ Run tests

**Day 3**:
- ✅ Fix any failing tests
- ✅ Set up GitHub
- ✅ Push code

**Day 4**:
- ✅ Create submission folder
- ✅ Zip and submit

---

## 📞 Need Help?

- **Playwright Docs**: https://playwright.dev/docs/intro
- **Node.js Docs**: https://nodejs.org/docs/
- **GitHub Guides**: https://guides.github.com/

---

**Good luck! You've got this! 🚀**



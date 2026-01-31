# 🔍 How to Find and Update Selectors

## Why Update Selectors?

The test files use generic selectors that may not match the actual website structure. You need to inspect the website and update the selectors to match the real elements.

---

## Step 1: Inspect the Website

1. Open https://www.swifttranslator.com/ in Chrome/Edge browser
2. Right-click on the **Singlish input field**
3. Click **"Inspect"** or press `F12`
4. The browser DevTools will open

---

## Step 2: Find the Singlish Input Field Selector

In DevTools, you'll see the HTML for the input field. Look for attributes like:
- `id="..."`
- `class="..."`
- `placeholder="..."`
- `name="..."`

### Example HTML:
```html
<textarea id="singlish-input" placeholder="Type Singlish here"></textarea>
```

### Possible Selectors:
```javascript
'#singlish-input'                           // By ID
'textarea[placeholder="Type Singlish here"]' // By placeholder
'textarea[name="singlish"]'                 // By name
'.singlish-input'                           // By class
```

---

## Step 3: Find the Sinhala Output Field Selector

Repeat the same process for the **Sinhala output field**.

### Example HTML:
```html
<textarea id="sinhala-output" placeholder="Sinhala translation" readonly></textarea>
```

### Possible Selectors:
```javascript
'#sinhala-output'                              // By ID
'textarea[placeholder="Sinhala translation"]'  // By placeholder
'textarea[readonly]'                           // By attribute
```

---

## Step 4: Update Selectors in Test Files

Open each test file and update the `SELECTORS` object:

### File: `tests/positive-tests.spec.js`
### File: `tests/negative-tests.spec.js`
### File: `tests/ui-tests.spec.js`

```javascript
const SELECTORS = {
  singlishInput: '#singlish-input',  // ✅ Update this with actual selector
  sinhalaOutput: '#sinhala-output',  // ✅ Update this with actual selector
};
```

---

## Step 5: Test Your Selectors

Use Playwright Inspector to test selectors:

```bash
npx playwright codegen https://www.swifttranslator.com/
```

This opens:
1. **Browser window** - interact with the website
2. **Inspector window** - see generated selectors

Click on elements to see their selectors automatically!

---

## Step 6: Common Selector Patterns

### By ID (Most Reliable)
```javascript
'#singlish-input'
'#sinhala-output'
```

### By Class
```javascript
'.input-singlish'
'.output-sinhala'
```

### By Placeholder
```javascript
'textarea[placeholder*="Singlish"]'  // Contains "Singlish"
'textarea[placeholder*="Sinhala"]'   // Contains "Sinhala"
```

### By Data Attribute
```javascript
'[data-testid="singlish-input"]'
'[data-testid="sinhala-output"]'
```

### By Role (Accessibility)
```javascript
page.getByRole('textbox', { name: 'Singlish' })
page.getByRole('textbox', { name: 'Sinhala' })
```

### By Text
```javascript
page.getByText('Singlish')
page.getByLabel('Enter Singlish')
```

---

## Step 7: Multiple Textareas (If Applicable)

If there are multiple textareas on the page:

```javascript
// First textarea (Singlish)
'textarea:nth-of-type(1)'

// Second textarea (Sinhala)
'textarea:nth-of-type(2)'

// Or use .first() and .last()
page.locator('textarea').first()  // Singlish
page.locator('textarea').last()   // Sinhala
```

---

## Step 8: Verify Selectors Work

Run a single test to verify:

```bash
npx playwright test --grep "Pos_Fun_0002" --headed
```

Watch the browser:
- ✅ Does it type in the correct input field?
- ✅ Does it read from the correct output field?

---

## 🔧 Quick Selector Reference

| Element | Selector Type | Example |
|---------|---------------|---------|
| ID | `#id` | `#singlish-input` |
| Class | `.class` | `.input-field` |
| Attribute | `[attr="value"]` | `[placeholder="Singlish"]` |
| Contains | `[attr*="value"]` | `[placeholder*="Sinhala"]` |
| nth-type | `:nth-of-type(n)` | `textarea:nth-of-type(1)` |
| First | `.first()` | `page.locator('textarea').first()` |
| Last | `.last()` | `page.locator('textarea').last()` |

---

## ⚠️ Important Tips

1. **Use Stable Selectors**: Prefer IDs and data attributes over classes (classes can change)
2. **Avoid Complex Selectors**: Keep selectors simple and maintainable
3. **Test One Selector First**: Verify one selector works before updating all files
4. **Use Playwright Inspector**: It's your best friend for finding selectors!

---

## 🎯 After Updating Selectors

1. ✅ Run all tests: `npm test`
2. ✅ Check if tests can interact with the page
3. ✅ Fix any selector issues
4. ✅ Document any special selector patterns used

---

**Need Help?**
Run `npx playwright codegen https://www.swifttranslator.com/` and click on elements to see their selectors!



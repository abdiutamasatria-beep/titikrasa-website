# Skill: Mengelola Menu & Voucher Titik Rasa

**Purpose**: Automate common tasks for managing menu items and voucher codes in the Titik Rasa website.

**When to use**: 
- Adding, updating, or removing menu items
- Creating or modifying voucher codes
- Bulk operations on menu/voucher data
- Validating menu prices and voucher minimums
- Exporting menu/voucher reports

---

## 📋 Menu Item Structure

Menu items are stored in `script.js` as a `MENU_ITEMS` array. Each item follows this format:

```javascript
[
  name,           // string: Dish name (Bahasa Indonesia)
  category,       // string: 'utama' (main) or 'minuman' (beverage)
  price,          // number: Price in IDR (Rupiah)
  imageUrl,       // string: Image URL (preferably Unsplash)
  description,    // string: Brief description in Bahasa Indonesia
  badge,          // string (optional): 'bestseller' or 'recommended'
  variants        // array (optional): Available options for customization
]
```

### Example Menu Item:
```javascript
['Nasi Goreng', 'utama', 28000, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 'Nasi goreng hangat dengan pilihan lauk favorit Anda.', '', ['Ayam', 'Udang', 'Sapi', 'Cumi']]
```

---

## 💰 Voucher Structure

Vouchers are stored in `script.js` as a `VOUCHERS` object. Each code has this structure:

```javascript
'CODE': {
  discount,      // number: Discount amount in IDR
  pointsCost,    // number: Points required to redeem
  minSpend,      // number: Minimum order amount to use voucher
  name           // string: Display name in Bahasa Indonesia
}
```

### Example Voucher:
```javascript
'TITIK10K': {
  discount: 10000,
  pointsCost: 10000,
  minSpend: 30000,
  name: 'Voucher Potongan Rp 10.000'
}
```

---

## 🛠️ Common Tasks

### ✅ Adding a New Menu Item

1. **Open** `script.js`
2. **Locate** the `MENU_ITEMS` array (around line 35-60)
3. **Add new entry** at the end (before closing bracket):
   ```javascript
   ['Nama Makanan', 'utama', price, 'imageUrl', 'Deskripsi', '', ['variant1', 'variant2']]
   ```
4. **Validation**:
   - ✓ Price must be positive integer (in IDR)
   - ✓ Category must be `'utama'` or `'minuman'`
   - ✓ Description must be in Bahasa Indonesia
   - ✓ Image URL should be accessible (test in browser)
   - ✓ Variants array is optional (omit empty array)

### ✅ Modifying an Existing Menu Item

1. **Find** the item in `MENU_ITEMS` array
2. **Update** specific fields:
   - Name: Change first element
   - Price: Update the number
   - Description: Modify text (keep in Bahasa Indonesia)
   - Badge: Add `'bestseller'` or `'recommended'`
   - Variants: Add/modify array of options
3. **Test** by reloading the page and checking menu grid

### ✅ Removing a Menu Item

1. **Find** the item in `MENU_ITEMS` array
2. **Delete** the entire line (including comma)
3. **Verify** no syntax errors by opening browser DevTools

### ✅ Creating a New Voucher

1. **Open** `script.js`
2. **Locate** the `VOUCHERS` object (around line 25-30)
3. **Add new entry**:
   ```javascript
   'NEWCODE': {
     discount: 15000,
     pointsCost: 15000,
     minSpend: 50000,
     name: 'Voucher Spesial Rp 15.000'
   }
   ```
4. **Validation**:
   - ✓ Code must be UPPERCASE and unique
   - ✓ Discount must be positive and reasonable
   - ✓ pointsCost should be equal or less than discount value
   - ✓ minSpend should be >= discount (to prevent negative totals)
   - ✓ name must be in Bahasa Indonesia

### ✅ Modifying a Voucher

1. **Find** the code in `VOUCHERS` object
2. **Update** the values:
   - `discount`: Change discount amount
   - `pointsCost`: Change points required
   - `minSpend`: Adjust minimum spend requirement
   - `name`: Update display name
3. **Test** by logging in with demo user and checking voucher panel

### ✅ Deactivating a Voucher

1. **Option A** - Delete the entry from `VOUCHERS` object
2. **Option B** - Set extremely high `minSpend` (e.g., 999999999) to make it unavailable
3. **Better** - Add a `disabled: true` property and update validation logic

---

## 🔍 Validation Checklist

### Before Saving Menu Changes:
- [ ] Price is positive integer (no decimals)
- [ ] Category is exactly `'utama'` or `'minuman'`
- [ ] Image URL returns 200 status (test in new tab)
- [ ] Description has no Bahasa English mix
- [ ] Variants (if present) are meaningful options
- [ ] No duplicate dish names
- [ ] Syntax is valid JavaScript (check DevTools)

### Before Saving Voucher Changes:
- [ ] Code is UPPERCASE and 5-10 characters
- [ ] Discount > 0 and < minSpend
- [ ] pointsCost is realistic for discount value
- [ ] minSpend >= discount (prevents negative totals)
- [ ] name is in Bahasa Indonesia and clear
- [ ] No duplicate codes
- [ ] Syntax is valid JavaScript (check DevTools)

---

## 🧪 Testing

### After Adding Menu Item:
1. Open `index.html` in browser (login with `081234567890` / `123456`)
2. Scroll to menu section
3. Verify new item appears in grid
4. Click "Pesan" button → check modal opens correctly
5. Test variant selection if applicable
6. Add to cart and verify price calculates correctly

### After Adding Voucher:
1. Login with demo account
2. Navigate to voucher section
3. Verify code appears with correct name and cost
4. Try to redeem with insufficient points → error message
5. Try to redeem with order below minSpend → error message
6. Try to redeem with valid order → discount applied correctly
7. Verify points deducted correctly after purchase

---

## 📊 Data Export Patterns

### Get All Menu Items by Category:
```javascript
const mainDishes = MENU_ITEMS.filter(item => item[1] === 'utama');
const beverages = MENU_ITEMS.filter(item => item[1] === 'minuman');
```

### Get Menu Items by Badge:
```javascript
const bestsellers = MENU_ITEMS.filter(item => item[5] === 'bestseller');
const recommended = MENU_ITEMS.filter(item => item[5] === 'recommended');
```

### Calculate Total Voucher Value:
```javascript
const totalValue = Object.values(VOUCHERS).reduce((sum, v) => sum + v.discount, 0);
```

### Get Average Menu Price:
```javascript
const avgPrice = MENU_ITEMS.reduce((sum, item) => sum + item[2], 0) / MENU_ITEMS.length;
```

---

## ⚠️ Important Notes

1. **No Hot Reload**: Changes to `MENU_ITEMS` and `VOUCHERS` require page refresh
2. **Array Indexing**: Menu items use positional indices (0-6), not named properties
3. **Price Format**: Always use IDR rupiah amounts (no decimal points)
4. **Image URLs**: Unsplash URLs work well; test CORS if using other sources
5. **Backup**: Keep backups of `script.js` before bulk modifications
6. **Variants**: Only add for items that truly have options (Nasi Goreng, Kopi, etc.)
7. **Voucher Math**: pointsCost should not exceed user's typical points balance

---

## 🚀 Advanced Tasks

### Bulk Add Menu Items from CSV:
1. Prepare CSV with: name, category, price, description, badge
2. Use this helper (add to script.js):
```javascript
function importMenuItemsFromCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const newItems = lines.map(line => {
        const [name, category, price, desc, badge] = line.split('|');
        return [name.trim(), category.trim(), parseInt(price), '', desc.trim(), badge.trim() || ''];
    });
    // Append to MENU_ITEMS and save to localStorage or alert for manual update
    console.log('Import preview:', newItems);
    return newItems;
}
```

### Validate All Vouchers:
```javascript
function validateVouchers() {
    Object.entries(VOUCHERS).forEach(([code, voucher]) => {
        if (voucher.discount >= voucher.minSpend) {
            console.warn(`⚠️ ${code}: discount (${voucher.discount}) >= minSpend (${voucher.minSpend})`);
        }
        if (voucher.pointsCost > voucher.discount * 2) {
            console.warn(`⚠️ ${code}: pointsCost (${voucher.pointsCost}) very high for discount (${voucher.discount})`);
        }
    });
}
```

---

## 📝 Related Files

- **Main Data**: [script.js](script.js) (Menu & Voucher definitions)
- **Menu Rendering**: Look for `renderMenuItems()` in [script.js](script.js)
- **Styling**: [style.css](style.css) (`.menu-card`, `.card-badge` classes)
- **Modal Logic**: Search `openOrderModal()` in [script.js](script.js)

---

**Last Updated**: 2026-08-25  
**Maintained for**: Menu management, voucher campaigns, Indonesian restaurant website

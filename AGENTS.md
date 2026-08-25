# Titik Rasa Website - AI Agent Guidelines

**Project**: Titik Rasa - Restaurant website for traditional Indonesian cuisine (Nusantara)  
**Tech Stack**: Vanilla HTML/CSS/JavaScript, no build tools or npm dependencies  
**Language**: Indonesian (Bahasa Indonesia)  
**Architecture**: Single-page application with localStorage for persistence

---

## 📋 Project Structure

```
PROJECT_WEBSITE_MAKANAN/
├── home/
│   ├── index.html       # Main restaurant page (after login)
│   ├── style.css        # Main stylesheet with CSS variables
│   ├── script.js        # Core logic: authentication, menu, cart, vouchers
│   └── security.js      # Security and session protection
├── assets/
│   └── logo.jpg         # Restaurant brand logo
├── docs/                # Technical and project documentation
├── README.md            # Project overview
├── login/
│   ├── login.html       # Authentication gate
│   ├── login.css        # Login page styling
│   └── login.js         # Login form logic
└── .git/                # Version control
```

---

## 🔑 Key Architecture Patterns

### Authentication & User Data
- **Storage**: localStorage
- **Keys**: 
  - `titikrasa_users_db` - All user accounts (JSON object keyed by phone number)
  - `titikrasa_current_phone` - Currently logged-in user's phone number
- **Redirect Logic**: Users without valid phone in localStorage are redirected to `login/login.html`
- **Default Test User**: Phone `081234567890` / Password `123456` / 25,000 points

### 🔐 Security Features (security.js)
- **Rate Limiting**: Max 5 failed login attempts, 15-minute account lockout
- **Session Timeout**: 30-minute inactivity timeout with activity tracking
- **Input Validation**: Phone number format, password strength, username sanitization
- **XSS Protection**: Input sanitization on all user inputs
- **Audit Logging**: Security events logged with timestamps and details
- **CSRF Protection**: Session tokens generated per login
- **Keys**:
  - `titikrasa_login_attempts` - Failed attempt tracking
  - `titikrasa_login_lockout` - Account lockout status
  - `titikrasa_session_activity` - Last activity timestamp
  - `titikrasa_audit_log` - Security event audit trail

### Menu System
- **Data Structure**: `MENU_ITEMS` array in script.js
  - Format: `[name, category, price, imageUrl, description, badge, variants]`
  - Categories: `'utama'` (main dish), `'minuman'` (beverage)
  - Badges: `'bestseller'`, `'recommended'` (optional)
  - Variants: Array of options (e.g., protein choices for Nasi Goreng)

### Points & Vouchers
- **Voucher Codes**: Defined in `VOUCHERS` object
  - Each voucher has: `discount`, `pointsCost`, `minSpend`, `name`
  - Example: `'TITIK10K'` = Rp 10,000 discount for 10,000 points (min Rp 30,000 spend)
- **Points Tracking**: Stored with user data in localStorage

### Styling
- **CSS Variables** (`:root` in style.css):
  - Colors: `--primary-gold`, `--accent-red`, `--bg-dark`, `--bg-warm`
  - Fonts: `--font-heading` (Playfair Display), `--font-body` (Plus Jakarta Sans)
  - Spacing/Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
  - Effects: `--gold-glow`, `--card-shadow` (smooth transitions via `--transition`)
- **Font Loading**: Google Fonts via CDN (preconnect in head)
- **Icon Library**: Lucide Icons via CDN (loaded via `<script>` tag)

---

## 🛠️ Common Development Tasks

### Adding a New Menu Item
1. Open `script.js`
2. Find `const MENU_ITEMS = [...]`
3. Add new entry: `['Nama Makanan', 'category', price, 'imageUrl', 'deskripsi', 'badge (optional)', ['variant1', 'variant2']]`
4. Price in IDR (Rupiah)
5. Refer to [SKILL-menu-voucher.md](SKILL-menu-voucher.md) for detailed validation

### Adding a New Voucher
1. Open `script.js`
2. Find `const VOUCHERS = {...}`
3. Add: `'CODE': { discount: amount, pointsCost: cost, minSpend: min, name: 'Display Name' }`
4. Refer to [SKILL-menu-voucher.md](SKILL-menu-voucher.md) for validation checklist

### Styling Updates
- Modify colors via CSS variables in `style.css` (lines 1-30)
- Ensure all color changes use `--transition` for smooth animations
- Mobile-responsive breakpoints use `@media (max-width: 768px)` pattern

### Testing Authentication
- Use phone `081234567890` with password `123456` to test login
- localStorage persists across page reloads
- Clear localStorage in DevTools to reset user state
- **Security Testing**: Rate limiting triggers after 5 failed attempts (15-min lockout)
- **Session Testing**: User will be logged out after 30 minutes of inactivity

---

## 📝 Code Conventions

### JavaScript
- Snake_case for constants: `STORAGE_USERS_KEY`, `MENU_ITEMS`
- camelCase for functions and variables: `handleLoginSubmit()`, `currentItem`
- Storage keys prefixed with `titikrasa_` to avoid collisions
- Comments use `// ============` separator for section headers

### HTML/CSS
- Language attribute: `<html lang="id">` (Indonesian)
- Class names: kebab-case (e.g., `login-card`, `form-group`)
- CSS organized by function (e.g., layout, components, utilities)
- SVG icons via Lucide: `<i data-lucide="icon-name"></i>` (auto-replaced via lucide.createIcons())

### Styling Philosophy
- **Warm Culinary Palette**: Gold (#D97706), deep red (#991B1B), warm whites
- **Glass-morphism Effects**: Semi-transparent backgrounds with blur
- **Glow Effects**: Gold glow on interactive elements (`--gold-glow`)
- **Smooth Interactions**: All transitions use 0.3s cubic-bezier(0.4, 0, 0.2, 1)

---

## ⚠️ Important Constraints & Pitfalls

1. **No Build Tools**: All JavaScript must be vanilla ES5/ES6 compatible in browsers
2. **External Dependencies**: Only via CDN (Google Fonts, Lucide Icons)
3. **localStorage Limitations**:
   - ~5-10MB per domain
   - Not available in private browsing in some browsers
   - No expiration unless manually implemented
4. **Image URLs**: Currently use Unsplash URLs; consider self-hosting for performance
5. **Responsive Design**: Must work on mobile (tests on device with DevTools mobile view)
6. **Indonesian Language**: All UI text must be in Bahasa Indonesia; preserve cultural context

---

## 🚀 When Implementing Features

### Before making changes:
- Check if feature affects authentication flow (`login.html`, `login.js`, redirect logic)
- Consider localStorage impact (data size, serialization)
- Test on mobile viewport (375px width minimum)

### After implementation:
- Verify default test user still works: `081234567890` / `123456`
- Check that localStorage keys don't conflict with existing data
- Ensure all text is in Indonesian
- Test CSS on browsers without latest features (use CSS variables, not newer APIs)

### Adding new pages/features:
- If new page: Add login redirect check at the top of HTML (see `index.html` line ~23)
- If new JavaScript: Follow `STORAGE_USERS_KEY` and `STORAGE_CURRENT_USER_KEY` patterns
- If new CSS: Use existing CSS variables; avoid hardcoded colors

---

## 📚 Related Documentation

- See [README.md](README.md) for project description and quick start
- Refer to [index.html](index.html) for HTML structure patterns
- Check [script.js](script.js) for complete data model and function implementations
- Review [style.css](style.css) for visual system and breakpoints
- Manage menu/vouchers: Use [SKILL-menu-voucher.md](SKILL-menu-voucher.md) for detailed task automation
- Security reference: [security.js](security.js) implements rate limiting, session timeout, audit logging

---

**Last Updated**: 2026-08-25  
**Maintained for**: Vanilla JS, responsive web design, Indonesian restaurant website with enhanced security

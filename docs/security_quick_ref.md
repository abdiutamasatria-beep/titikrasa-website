# 🛡️ Titik Rasa Security - Quick Reference Card

## Security Functions (security.js)

### Account Lockout
```javascript
isAccountLocked(phone)          // Check if account is locked
recordFailedLoginAttempt(phone) // Log failed attempt
resetLoginAttempts(phone)       // Clear attempts (after success)
```

### Session Management
```javascript
initializeSessionTracking(phone)  // Start session on login
updateSessionActivity()            // Called on user action
checkSessionTimeout()              // Check if session expired
handleSecureLogout(reason)         // Secure logout
```

### Input Validation
```javascript
isValidUsername(name)             // Check name format
isValidPhoneNumber(phone)          // Check phone format
validatePasswordStrength(password) // Get password score
sanitizeInput(input)               // Remove XSS threats
```

### Audit & Security
```javascript
generateSessionToken()             // Create session token
logSecurityEvent(type, details)    // Log security event
getAuditLog()                      // View all events
exportUserData()                   // Export user data
```

---

## Configuration (in security.js)

```javascript
const SECURITY_CONFIG = {
    MAX_LOGIN_ATTEMPTS: 5,           // Failed attempts before lockout
    LOCKOUT_DURATION_MINUTES: 15,    // Minutes to lock account
    SESSION_TIMEOUT_MINUTES: 30,     // Inactivity timeout
    INACTIVITY_CHECK_INTERVAL_SECONDS: 60  // Check frequency
};
```

---

## LocalStorage Keys

```javascript
// Rate Limiting
'titikrasa_login_attempts'   // Attempt tracking
'titikrasa_login_lockout'    // Lockout status

// Session
'titikrasa_session_activity' // Last activity time
'titikrasa_audit_log'        // Security events (max 100)

// User Data (existing)
'titikrasa_users_db'         // User database
'titikrasa_current_phone'    // Current user phone
```

---

## Security Events Logged

```javascript
LOGIN_SUCCESS              // Successful login
LOGIN_FAILED_WRONG_PASSWORD // Wrong password
LOGIN_BLOCKED_LOCKOUT      // Account locked
LOGIN_INVALID_NAME         // Invalid username
LOGIN_INVALID_PHONE        // Invalid phone number
LOGIN_WEAK_PASSWORD        // Weak password
REGISTRATION_SUCCESS       // New user registered
SESSION_TIMEOUT            // Session expired
DATA_EXPORT                // User data exported
LOGOUT_SECURE              // User logged out
```

---

## Test Commands (Browser Console)

```javascript
// 1. Check lockout status
isAccountLocked('081234567890')

// 2. View current session
JSON.parse(sessionStorage.getItem('titikrasa_session'))

// 3. View audit log
getAuditLog()

// 4. Validate inputs
isValidPhoneNumber('081234567890')
isValidUsername('Satria Wibowo')
validatePasswordStrength('MyPass123!')

// 5. Clear all security data (for reset)
localStorage.removeItem('titikrasa_login_attempts')
localStorage.removeItem('titikrasa_login_lockout')
localStorage.removeItem('titikrasa_audit_log')
```

---

## Common Errors & Solutions

### Error: "Akun terkunci... Coba lagi dalam X menit"
**Cause**: Too many failed login attempts  
**Solution**: Wait 15 minutes or manually clear in console:
```javascript
localStorage.removeItem('titikrasa_login_lockout')
localStorage.removeItem('titikrasa_login_attempts')
```

### Error: "Sesi Anda telah berakhir"
**Cause**: 30 minutes without activity  
**Solution**: Login again. Activity auto-extends session.

### Error: "Nomor telepon tidak valid"
**Cause**: Invalid Indonesian phone format  
**Solution**: Use format: 081234567890 or 62812345678

### Error: "Nama pengguna harus 2-50 karakter"
**Cause**: Invalid characters or wrong length  
**Solution**: Use only letters, numbers, spaces, hyphens

---

## Login Flow (Enhanced)

```
1. User enters: Name, Phone, Password
   ↓
2. Check: Is phone locked? → Show error if yes
   ↓
3. Validate: Name format → Phone format → Password
   ↓
4. Check: Existing user? 
   ├─ YES: Verify password
   │  ├─ Wrong: Record attempt → Show error
   │  └─ Right: Proceed to login
   └─ NO: Create new user (25K points)
   ↓
5. Reset attempt counter
   ↓
6. Initialize session tracking
   ↓
7. Log security event
   ↓
8. Redirect to main page (index.html)
```

---

## Session Monitoring (Runs Automatically)

```
Every 60 seconds:
  1. Check time since last activity
  2. If > 30 minutes:
     - Clear session
     - Log timeout event
     - Show alert
     - Redirect to login
  3. Else:
     - Continue monitoring
```

---

## Menu & Voucher Quick Ref

### Add Menu Item (in script.js)
```javascript
// Find: const MENU_ITEMS = [...]
// Add: ['Name', 'utama', price, 'imageUrl', 'desc', 'badge', ['variants']]

['Gado-Gado', 'utama', 22000, 'https://images.unsplash.com/...', 'Mix veggie', '', ['Banyak Bumbu', 'Sedikit Bumbu']]
```

### Add Voucher (in script.js)
```javascript
// Find: const VOUCHERS = {...}
// Add: 'CODE': { discount, pointsCost, minSpend, name }

'GADOGADO': { discount: 5000, pointsCost: 5000, minSpend: 20000, name: 'Diskon Gado-Gado 5K' }
```

---

## Files Reference

| File | Purpose |
|------|---------|
| security.js | All security functions |
| SECURITY.md | Detailed security docs |
| SKILL-menu-voucher.md | Menu management guide |
| AGENTS.md | AI agent guidelines |
| IMPLEMENTATION_SUMMARY.md | This implementation overview |
| login/login.js | Enhanced login handler |

---

**Pro Tip**: Use `/create-skill SKILL-security` to create AI automation for security management tasks!

Last Updated: 2026-08-25

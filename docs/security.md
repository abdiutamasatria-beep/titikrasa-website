# Keamanan Titik Rasa Website - Dokumentasi Teknis

**Tujuan**: Melindungi data pengguna dan mencegah penyalahgunaan aplikasi  
**Status**: Diimplementasikan dengan fitur-fitur keamanan berlapis  
**Last Updated**: 2026-08-25

---

## 🔐 Fitur Keamanan yang Diimplementasikan

### 1. **Rate Limiting (Pembatasan Percobaan Login)**
**File**: `security.js`

- **Maksimal Percobaan**: 5 kali percobaan login gagal
- **Durasi Lockout**: 15 menit penguncian akun
- **Storage Keys**:
  - `titikrasa_login_attempts` - Tracking percobaan gagal
  - `titikrasa_login_lockout` - Status lockout akun

**Cara Kerja**:
1. Setiap gagal login, counter ditambah
2. Setelah 5 kali gagal, akun dikunci otomatis
3. User melihat pesan: "Akun terkunci... Coba lagi dalam X menit"
4. Setelah 15 menit, akun otomatis terbuka kembali

**Testing**:
```javascript
// Simulasi: Coba login 5x dengan password salah
// Login pertama gagal: "Sisa percobaan: 4x"
// Login kelima gagal: Akun terkunci 15 menit
```

---

### 2. **Session Timeout (Batas Waktu Sesi)**
**File**: `security.js`

- **Durasi Sesi**: 30 menit tanpa aktivitas
- **Monitoring**: Setiap 60 detik dipantau
- **Activity Triggers**: Mouse move, keyboard, click
- **Storage**:
  - `titikrasa_session` (sessionStorage) - Data sesi aktif
  - `titikrasa_session_activity` (localStorage) - Waktu aktivitas terakhir

**Cara Kerja**:
1. User login → sesi dimulai
2. Setiap interaksi user (klik, ketik, gerak mouse) dicatat
3. Setiap 60 detik, sistem cek inaktivitas
4. Jika > 30 menit tidak ada aktivitas → logout otomatis
5. User melihat alert: "Sesi berakhir karena tidak ada aktivitas"

**Testing**:
```javascript
// 1. Login dengan demo account
// 2. Jangan lakukan aktivitas apapun
// 3. Tunggu ~31 menit (atau ubah SECURITY_CONFIG.SESSION_TIMEOUT_MINUTES untuk test lebih cepat)
// 4. Akan di-logout otomatis
```

---

### 3. **Input Validation (Validasi Input)**
**File**: `security.js`

#### A. **Username Validation**
- **Format**: 2-50 karakter
- **Charset**: Hanya huruf, angka, spasi, dan hyphen
- **Fungsi**: `isValidUsername(name)`

```javascript
// Valid: "Satria Wibowo", "Budi-Santoso", "User123"
// Invalid: "A" (terlalu pendek), "User@123" (karakter spesial), "اسم" (huruf Arabik)
```

#### B. **Phone Number Validation**
- **Format**: Indonesia (62 atau 0, 9-13 digit)
- **Fungsi**: `isValidPhoneNumber(phone)`

```javascript
// Valid: "081234567890", "62812345678", "+6281234567890"
// Invalid: "1234567890" (terlalu pendek), "+1234567890" (bukan Indo)
```

#### C. **Password Validation**
- **Minimal**: 6 karakter
- **Rekomendasi**: Mix huruf & angka
- **Fungsi**: `validatePasswordStrength(password)`

```javascript
// Strength Score (0-5):
// 0: "password" (no numbers)
// 1: "password123" (missing uppercase & special)
// 2: "Password123" (missing special char)
// 5: "MyPassword123!" (all requirements)
```

#### D. **XSS Protection (Sanitisasi)**
- **Fungsi**: `sanitizeInput(input)`
- **Cara**: Convert HTML special chars ke entities

```javascript
// Input: '<script>alert("XSS")</script>'
// Output: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

---

### 4. **CSRF Protection (Token Sesi)**
**File**: `security.js`

- **Token Format**: Random string + timestamp
- **Generated**: Setiap login dengan `generateSessionToken()`
- **Storage**: sessionStorage dalam object `titikrasa_session`

**Fungsi**:
```javascript
{
    phone: "081234567890",
    loginTime: "2026-08-25T10:30:00.000Z",
    lastActivityTime: "2026-08-25T10:35:45.000Z",
    sessionToken: "token_a9b2k3c4_1724148000000"
}
```

---

### 5. **Audit Logging (Pencatatan Peristiwa Keamanan)**
**File**: `security.js`

- **Storage Key**: `titikrasa_audit_log`
- **Max Entries**: 100 entry terbaru
- **Fungsi**: `logSecurityEvent(eventType, details)`

**Event Types yang Dicatat**:
- `LOGIN_SUCCESS` - Login berhasil
- `LOGIN_FAILED_WRONG_PASSWORD` - Password salah
- `LOGIN_BLOCKED_LOCKOUT` - Akun terkunci
- `REGISTRATION_SUCCESS` - Registrasi baru
- `LOGIN_INVALID_NAME` - Username tidak valid
- `LOGIN_INVALID_PHONE` - Phone tidak valid
- `SESSION_TIMEOUT` - Sesi timeout
- `DATA_EXPORT` - User export data
- `LOGOUT_SECURE` - Logout aman

**Akses Log**:
```javascript
const logs = getAuditLog();
console.table(logs); // Lihat dalam tabel format

// Filter by event type
const loginLogs = logs.filter(e => e.type === 'LOGIN_SUCCESS');
```

---

## 🔧 Integrasi ke Aplikasi

### Di Login Page (`login/login.html`)
```html
<!-- Load security.js sebelum login.js -->
<script src="../security.js"></script>
<script src="login.js"></script>
```

### Di Main Page (`index.html`)
```html
<!-- Load security.js di <head> -->
<script src="security.js"></script>
```

### Di Login Handler (`login/login.js`)
```javascript
// Cek lockout sebelum login
const lockStatus = isAccountLocked(phone);
if (lockStatus.locked) {
    showLoginError(`Akun terkunci... Coba lagi dalam ${lockStatus.remainingMins} menit`);
    return;
}

// Validasi input ketat
if (!isValidUsername(name)) { ... }
if (!isValidPhoneNumber(phone)) { ... }

// Sanitasi input sebelum simpan
db[phone].name = sanitizeInput(name);

// Log event keamanan
logSecurityEvent('LOGIN_SUCCESS', { phone: phone });

// Init session tracking
initializeSessionTracking(phone);
```

---

## 🧪 Testing Keamanan

### Test 1: Rate Limiting
```javascript
// Di browser console:
// 1. Coba login dengan password salah 5x
// Hasil: Akun terkunci 15 menit
// 2. Tunggu 15 menit atau reset manual:
localStorage.removeItem('titikrasa_login_lockout');
localStorage.removeItem('titikrasa_login_attempts');
```

### Test 2: Session Timeout
```javascript
// Di console (ubah konfigurasi sementara untuk testing):
SECURITY_CONFIG.SESSION_TIMEOUT_MINUTES = 0.1; // 6 detik untuk testing
// Login → tunggu 7 detik → akan logout otomatis
```

### Test 3: Input Validation
```javascript
// Test di console:
isValidUsername("Invalid@Name"); // false
isValidPhoneNumber("081234567890"); // true
validatePasswordStrength("weak123"); // strength: 2 (not recommended)
validatePasswordStrength("MyPass123!"); // strength: 5 (strong)
```

### Test 4: XSS Prevention
```javascript
// Di console:
const malicious = '<img src=x onerror="alert(\'XSS\')">';
const clean = sanitizeInput(malicious);
// Output: &lt;img src=x onerror=&quot;alert(&#x27;XSS&#x27;)&quot;&gt;
```

### Test 5: Audit Log
```javascript
// Di console:
const logs = getAuditLog();
console.table(logs); // Lihat semua event keamanan
console.log(logs.filter(e => e.type === 'LOGIN_FAILED_WRONG_PASSWORD'));
```

---

## ⚠️ Batasan & Catatan Penting

1. **Client-Side Only**: Keamanan ini implementasi di browser. Production harusnya juga punya server-side validation
2. **No Password Hashing**: Password disimpan plaintext di localStorage. Untuk production, gunakan bcrypt/hashing
3. **localStorage Keamanan**: Data rentan jika browser dikompromikan. Pertimbangkan HttpOnly cookies
4. **Session Storage**: sessionStorage dihapus saat tab ditutup (aman)
5. **Tanpa HTTPS**: Semua data di transfer plaintext. WAJIB gunakan HTTPS di production
6. **Local Storage Limit**: ~5-10MB per domain. Audit log tidak akan masalah dengan 100 entries

---

## 📋 Checklist Implementasi

- ✅ security.js dibuat dan berisi semua fungsi keamanan
- ✅ login.html menambahkan `<script src="../security.js"></script>`
- ✅ index.html menambahkan `<script src="security.js"></script>` di head
- ✅ login.js diupdate menggunakan fungsi security
- ✅ Rate limiting aktif (5 percobaan, 15 menit lockout)
- ✅ Session timeout aktif (30 menit inaktivitas)
- ✅ Input validation ketat
- ✅ XSS protection dengan sanitize
- ✅ Audit logging mencatat semua event
- ✅ Demo user masih berfungsi normal

---

## 🚀 Upgrade Recommendations untuk Production

1. **Backend Validation**: Semua validasi harus diulang di server
2. **Password Hashing**: Gunakan bcrypt/Argon2 untuk store password
3. **HTTPS Only**: Wajib enkripsi TLS/SSL
4. **HttpOnly Cookies**: Gunakan untuk session, bukan localStorage
5. **Rate Limiting Server**: Implementasi juga di API/backend
6. **2FA/MFA**: Tambahkan two-factor authentication
7. **CORS Policy**: Konfigurasi CORS yang ketat
8. **CSP Headers**: Implement Content Security Policy
9. **Audit Database**: Simpan audit log di server, bukan localStorage
10. **Monitoring**: Setup real-time security monitoring & alerts

---

**Dokumentasi ini akan diupdate seiring evolusi keamanan aplikasi.**

/* ==========================================================================
   AUTHENTICATION & LOGIN GATE CONTROLLER
   ========================================================================== */

function checkAuthStatus() {
    const user = getActiveUser();
    const loginGate = document.getElementById('login-gate');

    if (user) {
        if (loginGate) {
            loginGate.classList.remove('active');
        }
        syncUserUI(user);
        window.location.href = '../home/index.html';
    } else {
        if (loginGate) {
            loginGate.classList.add('active');
        }
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('login-name');
    const phoneInput = document.getElementById('login-phone');
    const passInput = document.getElementById('login-pass');
    const errorMsg = document.getElementById('login-error-msg');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim().replace(/[\s-]/g, '');
    const password = passInput.value.trim();

    // Check if account is locked
    const lockStatus = isAccountLocked(phone);
    if (lockStatus.locked) {
        showLoginError(`Akun terkunci karena terlalu banyak percobaan login gagal. Coba lagi dalam ${lockStatus.remainingMins} menit.`);
        logSecurityEvent('LOGIN_BLOCKED_LOCKOUT', { phone: phone });
        return;
    }

    // Validate input - Username
    if (!isValidUsername(name)) {
        showLoginError('Nama pengguna harus 2-50 karakter (huruf, angka, spasi, dan hyphen saja).');
        logSecurityEvent('LOGIN_INVALID_NAME', { name: name });
        return;
    }

    // Validate input - Phone
    if (!isValidPhoneNumber(phone)) {
        showLoginError('Format nomor telepon tidak valid. Gunakan nomor Indonesia dengan 8-13 digit.');
        logSecurityEvent('LOGIN_INVALID_PHONE', { phone: phone });
        return;
    }

    // Validate input - Password
    if (password.length < 6) {
        showLoginError('Password minimal 6 karakter. Gunakan kombinasi huruf dan angka untuk keamanan lebih baik.');
        logSecurityEvent('LOGIN_WEAK_PASSWORD', { phone: phone });
        return;
    }

    const db = getUsersDB();

    if (db[phone]) {
        // User exists -> verify password
        if (db[phone].password !== password) {
            recordFailedLoginAttempt(phone);
            const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}');
            const remainingAttempts = Math.max(0, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - (attempts[phone]?.count || 0));
            
            showLoginError(`Password salah. Sisa percobaan: ${remainingAttempts}x. Akun akan terkunci setelah ${SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS} percobaan gagal.`);
            logSecurityEvent('LOGIN_FAILED_WRONG_PASSWORD', { phone: phone });
            return;
        }

        // Successful login
        resetLoginAttempts(phone);
        
        // Update name if changed
        db[phone].name = sanitizeInput(name);
        saveUsersDB(db);
        setActiveUser(phone);
        
        // Initialize security session
        initializeSessionTracking(phone);
        logSecurityEvent('LOGIN_SUCCESS', { phone: phone });

        const loginGate = document.getElementById('login-gate');
        if (loginGate) loginGate.classList.remove('active');

        syncUserUI(db[phone]);
        alert(`👋 Selamat datang kembali, ${db[phone].name}! Saldo Titik Poin Anda: ${db[phone].points.toLocaleString('id-ID')} Poin.`);
        window.location.href = '../home/index.html';
    } else {
        // New Registration -> Grant 25,000 Welcome Points!
        const newUser = {
            name: sanitizeInput(name),
            phone: phone,
            password: password,
            points: 25000,
            registeredAt: new Date().toISOString()
        };

        db[phone] = newUser;
        saveUsersDB(db);
        setActiveUser(phone);
        
        // Initialize security session
        initializeSessionTracking(phone);
        logSecurityEvent('REGISTRATION_SUCCESS', { phone: phone });


        const loginGate = document.getElementById('login-gate');
        if (loginGate) loginGate.classList.remove('active');

        syncUserUI(newUser);
        alert(`🎉 Selamat bergabung di Titik Rasa, ${newUser.name}!\n\nNomor Anda (${newUser.phone}) berhasil terdaftar sebagai Member Resmi & mendapatkan BONUS 25.000 Titik Poin! Poin dapat langsung ditukar dengan voucher diskon makanan.`);
        window.location.href = '../home/index.html';
    }
}

function showLoginError(msg) {
    const errorMsg = document.getElementById('login-error-msg');
    if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = `⚠️ ${msg}`;
    }
}

function fillDemoAccount() {
    document.getElementById('login-name').value = 'Satria Abdi Utama';
    document.getElementById('login-phone').value = '085137756784';
    document.getElementById('login-pass').value = '123456';

    const fakeEvent = { preventDefault: () => { } };
    handleLoginSubmit(fakeEvent);
}

function handleLogout() {
    const user = getActiveUser();
    const confirmLogout = confirm(`Apakah Anda yakin ingin keluar dari akun ${user ? user.name : 'ini'} dan ganti nomor?`);
    if (!confirmLogout) return;

    setActiveUser(null);
    const loginGate = document.getElementById('login-gate');
    if (loginGate) {
        loginGate.classList.add('active');
    }

    // Reset fields
    document.getElementById('login-name').value = '';
    document.getElementById('login-phone').value = '';
    document.getElementById('login-pass').value = '';
    const errorMsg = document.getElementById('login-error-msg');
    if (errorMsg) errorMsg.style.display = 'none';

    // Hide profile bars
    const memberBar = document.getElementById('member-profile-bar');
    if (memberBar) memberBar.style.display = 'none';
    const drawerUser = document.getElementById('drawer-user-info');
    if (drawerUser) drawerUser.style.display = 'none';

    closeMobileDrawer();
}

function togglePasswordVisibility() {
    const passInput = document.getElementById('login-pass');
    const iconElem = document.getElementById('pwd-icon');

    if (passInput) {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            if (iconElem) iconElem.setAttribute('data-lucide', 'eye-off');
        } else {
            passInput.type = 'password';
            if (iconElem) iconElem.setAttribute('data-lucide', 'eye');
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

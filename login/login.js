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
        window.location.href = '../index.html';
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

    if (name.length < 2) {
        showLoginError('Nama pengguna harus diisi minimal 2 karakter.');
        return;
    }

    if (phone.length < 8) {
        showLoginError('Nomor telepon / WhatsApp minimal 8 digit angka.');
        return;
    }

    if (password.length < 6) {
        showLoginError('Password minimal 6 angka atau huruf.');
        return;
    }

    const db = getUsersDB();

    if (db[phone]) {
        // User exists -> verify password
        if (db[phone].password !== password) {
            showLoginError('Password salah untuk nomor ini! Silakan masukkan password yang tepat.');
            return;
        }

        // Update name if changed
        db[phone].name = name;
        saveUsersDB(db);
        setActiveUser(phone);

        const loginGate = document.getElementById('login-gate');
        if (loginGate) loginGate.classList.remove('active');

        syncUserUI(db[phone]);
        alert(`👋 Selamat datang kembali, ${db[phone].name}! Saldo Titik Poin Anda: ${db[phone].points.toLocaleString('id-ID')} Poin.`);
        window.location.href = '../index.html';
    } else {
        // New Registration -> Grant 25,000 Welcome Points!
        const newUser = {
            name: name,
            phone: phone,
            password: password,
            points: 25000,
            registeredAt: new Date().toISOString()
        };

        db[phone] = newUser;
        saveUsersDB(db);
        setActiveUser(phone);

        const loginGate = document.getElementById('login-gate');
        if (loginGate) loginGate.classList.remove('active');

        syncUserUI(newUser);
        alert(`🎉 Selamat bergabung di Titik Rasa, ${newUser.name}!\n\nNomor Anda (${newUser.phone}) berhasil terdaftar sebagai Member Resmi & mendapatkan BONUS 25.000 Titik Poin! Poin dapat langsung ditukar dengan voucher diskon makanan.`);
        window.location.href = '../index.html';
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
    document.getElementById('login-name').value = 'Satria Wibowo';
    document.getElementById('login-phone').value = '081234567890';
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

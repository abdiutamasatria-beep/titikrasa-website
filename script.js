/* ==========================================================================
   TITIK RASA - INTERACTIVE JAVASCRIPT & AUTHENTICATION LOGIC
   ========================================================================== */

// Storage Keys
const STORAGE_USERS_KEY = 'titikrasa_users_db';
const STORAGE_CURRENT_USER_KEY = 'titikrasa_current_phone';

// Default Seed User
const DEFAULT_USERS = {
    '081234567890': {
        name: 'Satria Wibowo',
        phone: '081234567890',
        password: '123456',
        points: 25000,
        registeredAt: new Date().toISOString()
    }
};

// Voucher Catalog
const VOUCHERS = {
    'TITIK10K': { discount: 10000, pointsCost: 10000, minSpend: 30000, name: 'Voucher Potongan Rp 10.000' },
    'TITIK20K': { discount: 20000, pointsCost: 20000, minSpend: 50000, name: 'Voucher Potongan Rp 20.000' },
    'SULTAN30K': { discount: 30000, pointsCost: 30000, minSpend: 90000, name: 'Voucher Sultan Rp 30.000' },
    'FREETELER': { discount: 20000, pointsCost: 15000, minSpend: 35000, name: 'Free 1 Es Teler Durian' }
};

let currentItem = {
    name: '',
    unitPrice: 0,
    qty: 1,
    appliedVoucherCode: '',
    discountAmount: 0,
    variant: ''
};

const MENU_ITEMS = [
    ['Rendang', 'utama', 38000, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'Daging sapi dimasak perlahan dengan rempah khas Minang.', 'bestseller'],
    ['Ayam Betutu', 'utama', 35000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 'Ayam lembut dengan bumbu rempah Bali yang kaya rasa.', 'recommended'],
    ['Rawon', 'utama', 32000, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', 'Sup daging sapi dengan kuah kluwek gurih dan aromatik.'],
    ['Gulai', 'utama', 30000, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', 'Gulai santan berbumbu rempah Nusantara yang harum.'],
    ['Kari', 'utama', 30000, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'Kari gurih dengan kuah rempah yang hangat dan lezat.'],
    ['Nasi Goreng', 'utama', 28000, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 'Nasi goreng hangat dengan pilihan lauk favorit Anda.', '', ['Ayam', 'Udang', 'Sapi', 'Cumi']],
    ['Nasi Kuning', 'utama', 26000, 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80', 'Nasi kuning gurih dengan pelengkap khas Nusantara.'],
    ['Babi Guling', 'utama', 45000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 'Sajian babi guling berbumbu khas Bali.'],
    ['Mie Aceh', 'utama', 30000, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', 'Mie berbumbu kari pedas khas Aceh dengan topping pilihan.'],
    ['Papeda', 'utama', 28000, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', 'Papeda lembut disajikan bersama kuah ikan berbumbu.'],
    ['Pempek', 'utama', 22000, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'Pempek ikan dengan kuah cuko khas Palembang.'],
    ['Wedang Jahe', 'minuman', 16000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'Minuman jahe hangat dengan aroma rempah yang menenangkan.'],
    ['Kopi', 'minuman', 18000, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80', 'Kopi pilihan dengan varian klasik dan modern.', '', ['Latte', 'Americano', 'Cappuccino', 'Kopi Tubruk', 'Es Kopi Susu']],
    ['Es Cendol Dawet', 'minuman', 18000, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', 'Cendol kenyal dengan santan dan gula aren.'],
    ['Es Teler', 'minuman', 20000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80', 'Alpukat, kelapa muda, nangka, dan es dengan kuah manis.', 'bestseller'],
    ['Soda Gembira', 'minuman', 15000, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80', 'Soda segar dengan sirup dan susu manis.'],
    ['Es Daluman', 'minuman', 17000, 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80', 'Minuman cincau hijau khas Bali yang menyegarkan.'],
    ['Matcha', 'minuman', 22000, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80', 'Matcha lembut dengan rasa khas yang seimbang.']
];

function renderMenuItems() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = MENU_ITEMS.map(([name, category, price, image, description, badge, variants]) => {
        const variantArgument = variants ? `, null, ${JSON.stringify(variants)}` : '';
        return `<div class="menu-card" data-category="${category}">
            <div class="card-image-wrap">
                <img src="${image}" alt="${name}" class="card-img" loading="lazy">
                ${badge ? `<span class="card-badge ${badge}">${badge === 'bestseller' ? 'BEST SELLER' : 'REKOMENDASI'}</span>` : ''}
                <div class="card-rating"><i data-lucide="star" fill="currentColor"></i> 4.9</div>
            </div>
            <div class="card-body">
                <h3 class="food-title">${name}</h3>
                <p class="food-desc">${description}</p>
                <div class="card-footer">
                    <div class="price-wrap"><span class="price-currency">Rp</span><span class="price-amount">${price.toLocaleString('id-ID')}</span></div>
                    <button class="btn btn-order" onclick='openOrderModal(${JSON.stringify(name)}, ${price}, ${JSON.stringify(image)}${variantArgument})'>
                        <i data-lucide="shopping-bag"></i> Pesan
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ==========================================================================
   INITIALIZATION & AUTH CHECK
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Check Auth Status on the login page only
    if (typeof checkAuthStatus === 'function') {
        checkAuthStatus();
    } else {
        syncUserUI(getActiveUser());
    }

    renderMenuItems();

    // 3. Mobile Drawer Navigation Elements
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileDrawer);
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeMobileDrawer);
    }

    // Keyboard ESC listener for closing modals & drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileDrawer();
            closeOrderModal();
            closeSupportModal();
        }
    });

    // 4. Scroll Events (Navbar Morph, Reading Progress Bar, Scrollspy)
    const navbarWrapper = document.getElementById('navbar-wrapper');
    const scrollProgressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('header[id], section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar Scroll Styling
        if (navbarWrapper) {
            if (scrollY > 30) {
                navbarWrapper.classList.add('navbar-scrolled');
            } else {
                navbarWrapper.classList.remove('navbar-scrolled');
            }
        }

        // Reading / Scroll Progress Bar Calculation
        if (scrollProgressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const scrollPercent = (scrollY / docHeight) * 100;
                scrollProgressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
            }
        }

        // Active Link Highlight on Scroll (Scrollspy)
        let currentSectionId = '';
        const scrollPosition = scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Update Desktop Nav Links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Update Mobile Drawer Links
        drawerLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 5. Menu Category Filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            menuCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

/* ==========================================================================
   DATABASE & USER STATE MANAGERS (LOCALSTORAGE)
   ========================================================================== */

function getUsersDB() {
    try {
        const data = localStorage.getItem(STORAGE_USERS_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
            return DEFAULT_USERS;
        }
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_USERS;
    }
}

function saveUsersDB(db) {
    try {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(db));
    } catch (e) {
        console.error('Error saving users database:', e);
    }
}

function getActiveUser() {
    const activePhone = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!activePhone) return null;
    const db = getUsersDB();
    return db[activePhone] || null;
}

function setActiveUser(phone) {
    if (phone) {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, phone);
    } else {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
}

function handleLogout() {
    const user = getActiveUser();
    const confirmLogout = confirm(`Apakah Anda yakin ingin keluar dari akun ${user ? user.name : 'ini'}?`);
    if (!confirmLogout) return;

    setActiveUser(null);
    window.location.href = 'login/login.html';
}


/* ==========================================================================
   SYNC USER UI & POINTS DISPLAY
   ========================================================================== */

function syncUserUI(user) {
    if (!user) return;

    // 1. Top Utility Bar
    const memberBar = document.getElementById('member-profile-bar');
    const barName = document.getElementById('bar-user-name');
    const barPhone = document.getElementById('bar-user-phone');
    const barPoints = document.getElementById('bar-user-points');

    if (memberBar) memberBar.style.display = 'inline-flex';
    if (barName) barName.innerText = user.name;
    if (barPhone) barPhone.innerText = user.phone;
    if (barPoints) barPoints.innerText = user.points.toLocaleString('id-ID');

    // 2. Mobile Drawer User Card
    const drawerUser = document.getElementById('drawer-user-info');
    const drawerName = document.getElementById('drawer-user-name');
    const drawerPhone = document.getElementById('drawer-user-phone');
    const drawerPoints = document.getElementById('drawer-user-points');

    if (drawerUser) drawerUser.style.display = 'flex';
    if (drawerName) drawerName.innerText = user.name;
    if (drawerPhone) drawerPhone.innerText = user.phone;
    if (drawerPoints) drawerPoints.innerText = user.points.toLocaleString('id-ID');

    // 3. Points Section Dashboard
    const dashName = document.getElementById('dash-user-name');
    const dashPhone = document.getElementById('dash-user-phone');
    const pointsVal = document.getElementById('user-points-val');
    const checkPhone = document.getElementById('check-points-phone');
    const checkStatus = document.getElementById('check-points-status');

    if (dashName) dashName.innerText = user.name;
    if (dashPhone) dashPhone.innerText = user.phone;
    if (pointsVal) pointsVal.innerText = user.points.toLocaleString('id-ID');
    if (checkPhone) checkPhone.value = user.phone;

    if (checkStatus) {
        checkStatus.style.display = 'flex';
        checkStatus.innerHTML = `<i data-lucide="check-circle-2"></i> Akun Member <strong>${user.name}</strong> (${user.phone}) aktif terverifikasi! Saldo: <strong>${user.points.toLocaleString('id-ID')} Poin</strong>`;
    }

    // 4. Contact Form Auto-fill
    const formName = document.getElementById('form-name');
    const formPhone = document.getElementById('form-phone');
    if (formName && !formName.value) formName.value = user.name;
    if (formPhone && !formPhone.value) formPhone.value = user.phone;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function simulateCheckPoints() {
    const phoneInput = document.getElementById('check-points-phone');
    const statusMsg = document.getElementById('check-points-status');

    if (!phoneInput || !phoneInput.value.trim()) {
        alert('Silakan masukkan nomor WhatsApp Anda terlebih dahulu.');
        return;
    }

    const searchPhone = phoneInput.value.trim().replace(/[\s-]/g, '');
    const db = getUsersDB();

    if (db[searchPhone]) {
        const foundUser = db[searchPhone];
        if (statusMsg) {
            statusMsg.style.display = 'flex';
            statusMsg.innerHTML = `<i data-lucide="check-circle-2"></i> Member Ditemukan: <strong>${foundUser.name}</strong> (${foundUser.phone}) memiliki <strong>${foundUser.points.toLocaleString('id-ID')} Poin</strong>!`;
        }
        document.getElementById('user-points-val').innerText = foundUser.points.toLocaleString('id-ID');
    } else {
        if (statusMsg) {
            statusMsg.style.display = 'flex';
            statusMsg.innerHTML = `<i data-lucide="info"></i> Nomor <strong>${searchPhone}</strong> belum terdaftar. Silakan keluar dan daftar untuk klaim 25.000 Poin!`;
        }
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/* ==========================================================================
   VOUCHER CLAIMING (DEDUCTS REAL POINTS FOR LOGGED-IN NUMBER)
   ========================================================================== */

function claimVoucherDirect(code, discountVal, pointsCost, minSpend) {
    const user = getActiveUser();
    if (!user) {
        alert('Silakan login terlebih dahulu untuk menukarkan poin Anda.');
        window.location.href = 'login/login.html';
        return;
    }

    if (user.points < pointsCost) {
        alert(`Maaf ${user.name}, saldo Titik Poin Anda (${user.points.toLocaleString('id-ID')} Poin) belum mencukupi untuk menukar voucher ini (${pointsCost.toLocaleString('id-ID')} Poin). Silakan kumpulkan poin lagi lewat transaksi belanja!`);
        return;
    }

    const confirmClaim = confirm(`Halo ${user.name}!\nKonfirmasi penukaran ${pointsCost.toLocaleString('id-ID')} Titik Poin untuk voucher diskon ${formatRupiah(discountVal)} (Kode: ${code})?`);
    if (!confirmClaim) return;

    // Deduct points permanently for this user
    user.points -= pointsCost;
    const db = getUsersDB();
    db[user.phone].points = user.points;
    saveUsersDB(db);

    // Sync updated UI
    syncUserUI(user);

    alert(`🎉 Selamat ${user.name}! Anda berhasil menukar ${pointsCost.toLocaleString('id-ID')} Poin. Sisa saldo poin Anda: ${user.points.toLocaleString('id-ID')} Poin.\n\nVoucher ${code} senilai ${formatRupiah(discountVal)} otomatis aktif pada pesanan Anda!`);

    // Pre-fill or open modal with Paket Sultan or prompt user
    openOrderModal('Paket Sultan Nusantara (Lengkap)', 105000, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80', code);
}

/* ==========================================================================
   MOBILE DRAWER CONTROLLER
   ========================================================================== */

function openMobileDrawer() {
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const mobileToggle = document.getElementById('mobile-toggle');

    if (mobileDrawer && drawerBackdrop) {
        mobileDrawer.classList.add('active');
        drawerBackdrop.classList.add('active');
        if (mobileToggle) {
            mobileToggle.classList.add('is-active');
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileDrawer() {
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const mobileToggle = document.getElementById('mobile-toggle');

    if (mobileDrawer && drawerBackdrop) {
        mobileDrawer.classList.remove('active');
        drawerBackdrop.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.classList.remove('is-active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }
}

function toggleMobileDrawer() {
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeMobileDrawer();
    } else {
        openMobileDrawer();
    }
}

/* ==========================================================================
   ORDER MODAL & WHATSAPP INTEGRATION (WITH VOUCHER DISCOUNT)
   ========================================================================== */

function openOrderModal(foodName, price, imgUrl, autoVoucherCode = '', variants = []) {
    const user = getActiveUser();
    if (!user) {
        alert('Silakan login terlebih dahulu untuk memesan.');
        window.location.href = 'login/login.html';
        return;
    }

    currentItem.name = foodName;
    currentItem.unitPrice = price;
    currentItem.qty = 1;
    currentItem.appliedVoucherCode = '';
    currentItem.discountAmount = 0;
    currentItem.variant = '';

    document.getElementById('modal-food-name').innerText = foodName;
    document.getElementById('modal-food-price').innerText = formatRupiah(price);
    document.getElementById('modal-food-img').src = imgUrl;
    document.getElementById('qty-val').innerText = currentItem.qty;

    // Clear inputs
    document.getElementById('table-num').value = '';
    document.getElementById('extra-notes').value = '';

    const variantGroup = document.getElementById('order-variant-group');
    const variantSelect = document.getElementById('order-variant');
    if (variantGroup && variantSelect) {
        variantSelect.innerHTML = variants.map(variant => `<option value="${variant}">${variant}</option>`).join('');
        variantGroup.style.display = variants.length ? 'block' : 'none';
        currentItem.variant = variants[0] || '';
        variantSelect.onchange = () => {
            currentItem.variant = variantSelect.value;
        };
    }

    const voucherInput = document.getElementById('voucher-input');
    const voucherMsg = document.getElementById('voucher-status-msg');

    if (voucherInput) {
        voucherInput.value = autoVoucherCode || '';
    }

    if (voucherMsg) {
        voucherMsg.className = 'voucher-status-msg';
        voucherMsg.innerText = '';
        voucherMsg.style.display = 'none';
    }

    if (autoVoucherCode) {
        applyVoucher();
    } else {
        updateTotalPrice();
    }

    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function closeOrderModal() {
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.classList.remove('active');
    }

    const supportModal = document.getElementById('supportModal');
    if (!supportModal || !supportModal.classList.contains('active')) {
        document.body.style.overflow = '';
    }
}

function updateQty(change) {
    currentItem.qty += change;
    if (currentItem.qty < 1) currentItem.qty = 1;
    document.getElementById('qty-val').innerText = currentItem.qty;
    updateTotalPrice();
}

function applyVoucher() {
    const voucherInput = document.getElementById('voucher-input');
    const voucherMsg = document.getElementById('voucher-status-msg');
    if (!voucherInput || !voucherMsg) return;

    const rawCode = voucherInput.value.trim().toUpperCase();

    if (!rawCode) {
        currentItem.appliedVoucherCode = '';
        currentItem.discountAmount = 0;
        voucherMsg.className = 'voucher-status-msg';
        voucherMsg.style.display = 'none';
        updateTotalPrice();
        return;
    }

    const voucherData = VOUCHERS[rawCode];
    const subtotal = currentItem.unitPrice * currentItem.qty;

    if (!voucherData) {
        currentItem.appliedVoucherCode = '';
        currentItem.discountAmount = 0;
        voucherMsg.className = 'voucher-status-msg error';
        voucherMsg.innerText = '❌ Kode voucher tidak valid atau sudah kadaluarsa.';
        voucherMsg.style.display = 'block';
        updateTotalPrice();
        return;
    }

    if (subtotal < voucherData.minSpend) {
        currentItem.appliedVoucherCode = '';
        currentItem.discountAmount = 0;
        voucherMsg.className = 'voucher-status-msg error';
        voucherMsg.innerText = `⚠️ Minimal belanja untuk voucher ini adalah ${formatRupiah(voucherData.minSpend)}. Tambah porsi untuk gunakan!`;
        voucherMsg.style.display = 'block';
        updateTotalPrice();
        return;
    }

    // Success apply voucher
    currentItem.appliedVoucherCode = rawCode;
    currentItem.discountAmount = voucherData.discount;
    voucherMsg.className = 'voucher-status-msg success';
    voucherMsg.innerText = `✅ Berhasil! Potongan ${formatRupiah(voucherData.discount)} aktif memotong harga asli.`;
    voucherMsg.style.display = 'block';
    updateTotalPrice();
}

function updateTotalPrice() {
    const subtotal = currentItem.unitPrice * currentItem.qty;
    const calcQtyElem = document.getElementById('calc-qty');
    const subtotalElem = document.getElementById('modal-subtotal-price');
    const discountLine = document.getElementById('discount-line');
    const discountValElem = document.getElementById('modal-discount-val');
    const totalPriceElem = document.getElementById('modal-total-price');

    if (calcQtyElem) calcQtyElem.innerText = currentItem.qty;
    if (subtotalElem) subtotalElem.innerText = formatRupiah(subtotal);

    // Re-verify minimum spend if voucher is applied
    if (currentItem.appliedVoucherCode) {
        const voucherData = VOUCHERS[currentItem.appliedVoucherCode];
        if (voucherData && subtotal < voucherData.minSpend) {
            currentItem.discountAmount = 0;
            const voucherMsg = document.getElementById('voucher-status-msg');
            if (voucherMsg) {
                voucherMsg.className = 'voucher-status-msg error';
                voucherMsg.innerText = `⚠️ Subtotal kurang dari min. belanja ${formatRupiah(voucherData.minSpend)}. Diskon dinonaktifkan.`;
                voucherMsg.style.display = 'block';
            }
        } else if (voucherData) {
            currentItem.discountAmount = voucherData.discount;
        }
    }

    const finalTotal = Math.max(0, subtotal - currentItem.discountAmount);

    if (discountLine && discountValElem) {
        if (currentItem.discountAmount > 0) {
            discountLine.style.display = 'flex';
            discountValElem.innerText = `- ${formatRupiah(currentItem.discountAmount)}`;
        } else {
            discountLine.style.display = 'none';
        }
    }

    if (totalPriceElem) {
        totalPriceElem.innerText = formatRupiah(finalTotal);
    }
}

function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function sendWhatsAppOrder() {
    const user = getActiveUser();
    const orderType = document.getElementById('order-type').value;
    const tableNum = document.getElementById('table-num').value.trim() || 'Tidak diisi';
    const notes = document.getElementById('extra-notes').value.trim() || 'Tidak ada';
    const subtotal = currentItem.unitPrice * currentItem.qty;
    const finalTotal = Math.max(0, subtotal - currentItem.discountAmount);

    let discountInfo = '';
    if (currentItem.appliedVoucherCode && currentItem.discountAmount > 0) {
        discountInfo = `• *Voucher Diskon Poin:* ${currentItem.appliedVoucherCode} (-${formatRupiah(currentItem.discountAmount)})\n`;
    }

    const customerName = user ? `${user.name} (${user.phone})` : 'Tamu Member';
    const variantInfo = currentItem.variant ? ` (${currentItem.variant})` : '';

    const message = `*HALO TITIK RASA, SAYA MAU PESAN!* 🍽️\n\n` +
        `• *Pemesan:* ${customerName}\n` +
        `• *Menu / Paket:* ${currentItem.name}${variantInfo}\n` +
        `• *Jumlah:* ${currentItem.qty} Porsi\n` +
        `• *Subtotal Harga:* ${formatRupiah(subtotal)}\n` +
        discountInfo +
        `• *TOTAL PEMBAYARAN:* ${formatRupiah(finalTotal)}\n` +
        `• *Tipe Pesanan:* ${orderType}\n` +
        `• *Meja / Alamat:* ${tableNum}\n` +
        `• *Catatan Khusus:* ${notes}\n\n` +
        `Mohon segera diproses pesanan saya. Terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    closeOrderModal();
}

/* ==========================================================================
   SUPPORT MODAL LOGIC
   ========================================================================== */

function openSupportModal() {
    const supportModal = document.getElementById('supportModal');
    if (supportModal) {
        supportModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSupportModal() {
    const supportModal = document.getElementById('supportModal');
    if (supportModal) {
        supportModal.classList.remove('active');
    }

    const orderModal = document.getElementById('orderModal');
    if (!orderModal || !orderModal.classList.contains('active')) {
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   CONTACT FORM SUBMIT HANDLER
   ========================================================================== */

function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('form-name').value;
    const phone = document.getElementById('form-phone').value;
    const people = document.getElementById('form-people').value;
    const messageText = document.getElementById('form-message').value;

    const message = `*RESERVASI TITIK RASA* 📅\n\n` +
        `• *Nama:* ${name}\n` +
        `• *No. WA:* ${phone}\n` +
        `• *Jumlah Rombongan:* ${people}\n` +
        `• *Pesan:* ${messageText || '-'}\n\n` +
        `Mohon konfirmasi ketersediaan meja. Terima kasih!`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

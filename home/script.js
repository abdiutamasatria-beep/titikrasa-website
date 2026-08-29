/* ==========================================================================
   TITIK RASA - ADVANCED INTERACTIVE JAVASCRIPT
   Features: Cart with Level 0-5 Spice Selector, Table QR, Live Search, Reviews, Reservation Pass, QRIS, Dual Kitchen
   ========================================================================== */

// Storage Keys
const STORAGE_USERS_KEY = 'titikrasa_users_db';
const STORAGE_CURRENT_USER_KEY = 'titikrasa_current_phone';
const STORAGE_CART_KEY = 'titikrasa_cart_items';
const STORAGE_APPLIED_VOUCHER_KEY = 'titikrasa_applied_voucher';
const STORAGE_REVIEWS_KEY = 'titikrasa_user_reviews';

// Spice Level Definitions (Level 0 - 5)
const SPICE_LEVEL_CONFIG = {
    0: { icon: '🚫', label: 'Level 0 (Tidak Pedas)', desc: 'Manis & Gurih Original' },
    1: { icon: '🌶️', label: 'Level 1 (Pedas Ringan)', desc: 'Sensasi Hangat Nyaman' },
    2: { icon: '🌶️🌶️', label: 'Level 2 (Pedas Sedang)', desc: 'Standar Racikan Resto' },
    3: { icon: '🌶️🌶️🌶️', label: 'Level 3 (Pedas Mantap)', desc: 'Pedas Nendang Berempah' },
    4: { icon: '🔥', label: 'Level 4 (Ekstra Pedas)', desc: 'Sensasi Pedas Membakar' },
    5: { icon: '💥', label: 'Level 5 (Sultan Pedas)', desc: 'Super Pedas Mampus Maksimal' }
};

// Default Seed User
const DEFAULT_USERS = {
    '085137756784': {
        name: 'Satria Abdi Utama',
        phone: '085137756784',
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

// Menu catalog with Dual Kitchen dietary & Variants
// Format: [name, category, price, image, description, badge, variants, dietary]
const MENU_ITEMS = [
    ['Rendang Sapi Warisan', 'utama', 38000, '../assets/menu/rendang.jpeg', 'Daging sapi pilihan dimasak perlahan 8 jam dengan rempah Minang autentik Padang.', 'bestseller', null, 'halal'],
    ['Ayam Betutu Rempah Bali', 'utama', 35000, '../assets/menu/ayambetutu.jpg', 'Ayam lembut bumbu base genep khas Gianyar Bali, disajikan lengkap dengan plecing & sambal matah.', 'recommended', null, 'halal'],
    ['Rawon Daging Sapi Kluwek', 'utama', 32000, '../assets/menu/rawon.jpg', 'Sup daging sapi kuah kluwek hitam pekat gurih aromatik khas Jawa Timur bertabur tauge pendek.', '', null, 'halal'],
    ['Gulai Rempah Nusantara', 'utama', 30000, '../assets/menu/gulai.jpg', 'Gulai santan kaya rempah harum dengan potongan daging lembut dan kuah kuning gurih.', '', null, 'halal'],
    ['Kari Daging Spesial', 'utama', 30000, '../assets/menu/kari.jpg', 'Kari gurih hangat berpadu kuah rempah kental menggugah selera khas Melayu.', '', null, 'halal'],
    ['Nasi Goreng Nusantara', 'utama', 28000, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 'Nasi goreng harum dengan bumbu racik istimewa, telur ceplok, dan pilihan lauk favorit.', '', ['Ayam Suwir', 'Udang', 'Daging Sapi', 'Cumi Bakar'], 'halal'],
    ['Nasi Kuning Komplit', 'utama', 26000, '../assets/menu/NasiKuning.jpg', 'Nasi kuning santan pulen dengan serundeng kelapa wangi, tempe orek manis, dan telur balado.', '', null, 'halal'],
    ['Sate Maranggi Sapi Empuk', 'utama', 32000, 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80', '10 tusuk sate sapi bakar arang kelapa dengan marinasi ketumbar manis gurih & sambal kecap pedas.', 'bestseller', null, 'halal'],
    ['Babi Guling Khas Bali', 'utama', 45000, '../assets/menu/babiguling.jpg', 'Sajian babi guling renyah berbumbu rempah Bali. (Dimasak di Dapur Non-Halal Khusus Terpisah).', '', null, 'non-halal'],
    ['Mie Aceh Rempah Pedas', 'utama', 30000, '../assets/menu/mieaceh.jpg', 'Mie tebal kenyal berkuah kari pedas kaya rempah pekat dengan irisan daging sapi & emping.', '', null, 'halal'],
    ['Papeda Kuah Kuning Ikan', 'utama', 28000, '../assets/menu/papeda.jpg', 'Papeda sagu lembut kenyal disajikan bersama sup ikan kuah kuning asam pedas segar khas Papua.', '', null, 'halal'],
    ['Pempek Palembang Asli', 'utama', 22000, '../assets/menu/pempek.jpg', 'Pempek ikan tenggiri kenyal gurih dengan kuah cuko asam manis pedas pekat gula aren Linggau.', '', null, 'halal'],
    ['Wedang Jahe Merah', 'minuman', 16000, '../assets/menu/wedangjahe.jpg', 'Seduhan jahe merah bakar murni hangat dengan aroma sereh & pandan wangi berkhasiat.', '', null, 'halal'],
    ['Kopi Nusantara Titik Rasa', 'minuman', 18000, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80', 'Kopi biji Nusantara pilihan dengan racikan barista tradisional maupun modern.', '', ['Es Kopi Susu Aren', 'Kopi Tubruk Asli', 'Caffe Latte', 'Americano', 'Cappuccino'], 'halal'],
    ['Es Cendol Dawet Gula Aren', 'minuman', 18000, '../assets/menu/escendol.jpg', 'Cendol kenyal daun pandan suji berpadu santan gurih dan sirup gula aren pekat legit.', '', null, 'halal'],
    ['Es Teler Durian Istimewa', 'minuman', 20000, '../assets/menu/esteler.jpg', 'Alpukat mentega, kelapa muda, nangka, kuah susu manis & topping daging durian asli melimpah.', 'bestseller', null, 'halal'],
    ['Soda Gembira Nostalgia', 'minuman', 15000, '../assets/menu/sodagembira.jpg', 'Kombinasi soda segar, sirup cocopandan merah, dan susu kental manis menyegarkan dahaga.', '', null, 'halal'],
    ['Es Daluman Cincau Hijau', 'minuman', 17000, '../assets/menu/esdaluman.jpg', 'Minuman cincau hijau alami khas Bali dengan santan kelapa dan gula aren cair murni.', '', null, 'halal'],
    ['Matcha Latte Tradisional', 'minuman', 22000, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80', 'Matcha grade murni lembut berpadu susu segar disajikan dingin menyegarkan.', '', null, 'halal']
];

// Initial Customer Reviews Data
const DEFAULT_REVIEWS = [
    {
        id: 'rev_1',
        name: 'Budi Santoso',
        date: '2 hari lalu',
        rating: 5,
        dish: 'Rendang Sapi Warisan',
        comment: 'Rendang Level 3 pedasnya mantap dan luar biasa empuk! Bumbu Minangnya sangat medok dan meresap sampai ke serat terdalam.',
        verified: true
    },
    {
        id: 'rev_2',
        name: 'Ni Luh Putu Ayu',
        date: '3 hari lalu',
        rating: 5,
        dish: 'Ayam Betutu Rempah Bali',
        comment: 'Ayam Betutu Level 2 pas banget gurihnya, rasa rempah base genep khas Bali tulen. Sambal matahnya bikin nagih!',
        verified: true
    },
    {
        id: 'rev_3',
        name: 'Dimas Prasetyo',
        date: '1 minggu lalu',
        rating: 5,
        dish: 'Babi Guling Khas Bali',
        comment: 'Sangat mengapresiasi transparansi 2 dapurnya! Babi gulingnya super renyah dan gurih, keluarga yang muslim bisa makan rendang dengan tenang karena dapur 100% terpisah.',
        verified: true
    },
    {
        id: 'rev_4',
        name: 'Siti Rahmawati',
        date: '1 minggu lalu',
        rating: 5,
        dish: 'Es Teler Durian Istimewa',
        comment: 'Es teler durian terenak di Bali! Daging duriannya melimpah, santannya gurih pas, manisnya legit alami.',
        verified: true
    }
];

// State Variables
let pendingModalItem = null;
let currentModalQty = 1;
let currentModalSpice = 1;
let currentTableNum = '';
let currentFilterCategory = 'all';
let currentPriceFilter = 'all';
let currentSearchQuery = '';

/* ==========================================================================
   1. TABLE QR AUTO-DETECT SYSTEM
   ========================================================================== */

function checkTableQrParam() {
    const urlParams = new URLSearchParams(window.location.search);
    let mejaParam = urlParams.get('meja');

    if (!mejaParam && window.location.hash.includes('meja=')) {
        mejaParam = window.location.hash.split('meja=')[1]?.split('&')[0];
    }

    if (mejaParam) {
        setTableNumber(mejaParam);
    }
}

function setTableNumber(num) {
    currentTableNum = num.toString().replace(/^meja\s*/i, '').trim();
    const banner = document.getElementById('table-qr-banner');
    const tableText = document.getElementById('table-qr-number');
    const locationInput = document.getElementById('cart-location-input');
    const orderTypeSelect = document.getElementById('cart-order-type');

    if (banner && tableText) {
        tableText.innerText = `Meja No. ${currentTableNum}`;
        banner.style.display = 'flex';
    }

    if (locationInput) {
        locationInput.value = `Meja No. ${currentTableNum}`;
    }
    if (orderTypeSelect) {
        orderTypeSelect.value = 'Makan di Tempat (Dine In)';
    }

    showToast(`🍽️ <strong>Meja No. ${currentTableNum}</strong> terdeteksi! Pesanan langsung diantar ke meja Anda.`);
}

function simulateTableScan(tableNumber) {
    setTableNumber(tableNumber);
    closeTableSimulatorModal();
}

function openTableSimulatorModal() {
    const modal = document.getElementById('tableSimulatorModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeTableSimulatorModal() {
    const modal = document.getElementById('tableSimulatorModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   2. MENU RENDERING, LIVE SEARCH & FILTERS
   ========================================================================== */

function renderMenuItems() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = MENU_ITEMS.map(([name, category, price, image, description, badge, variants, dietary]) => {
        const dietaryBadge = dietary === 'non-halal'
            ? `<span class="dietary-badge badge-nonhalal" title="Dimasak di Dapur Non-Halal Khusus Terpisah"><i data-lucide="flame"></i> NON-HALAL</span>`
            : `<span class="dietary-badge badge-halal" title="Dimasak di Dapur Halal Khusus Terpisah"><i data-lucide="check"></i> 100% HALAL</span>`;

        const promoBadge = badge
            ? `<span class="card-badge ${badge}">${badge === 'bestseller' ? 'BEST SELLER' : 'REKOMENDASI'}</span>`
            : '';

        const spiceAvailabilityBadge = category === 'utama'
            ? `<span class="card-spice-avail" title="Tersedia pilihan Level Pedas 0 s/d 5"><i data-lucide="flame"></i> Pilihan Level 0 - 5</span>`
            : '';

        const itemJson = JSON.stringify({ name, category, price, image, description, variants, dietary });

        return `
        <div class="menu-card" data-name="${name}" data-category="${category}" data-dietary="${dietary}" data-price="${price}" data-desc="${description}">
            <div class="card-image-wrap">
                <img src="${image}" alt="${name}" class="card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
                <div class="card-badge-container">
                    ${dietaryBadge}
                    ${promoBadge}
                </div>
                ${spiceAvailabilityBadge}
                <div class="card-rating"><i data-lucide="star" fill="currentColor"></i> 4.9</div>
            </div>
            <div class="card-body">
                <h3 class="food-title">${name}</h3>
                <p class="food-desc">${description}</p>
                <div class="card-footer">
                    <div class="price-wrap">
                        <span class="price-currency">Rp</span>
                        <span class="price-amount">${price.toLocaleString('id-ID')}</span>
                    </div>
                    <button class="btn btn-order btn-add-cart" onclick='handleMenuAddClick(${itemJson.replace(/'/g, "&apos;")})'>
                        <i data-lucide="plus-circle"></i> Pesan
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
    applyAllMenuFilters();
}

function handleLiveSearch(event) {
    currentSearchQuery = event.target.value;
    const clearBtn = document.getElementById('search-clear-btn');
    if (clearBtn) {
        clearBtn.style.display = currentSearchQuery ? 'block' : 'none';
    }
    applyAllMenuFilters();
}

function clearSearchInput() {
    const input = document.getElementById('menu-search-input');
    if (input) {
        input.value = '';
        currentSearchQuery = '';
    }
    const clearBtn = document.getElementById('search-clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    applyAllMenuFilters();
}

function filterMenuCategory(category) {
    currentFilterCategory = category;
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    applyAllMenuFilters();
}

function filterPriceRange(range) {
    currentPriceFilter = range;
    const priceBtns = document.querySelectorAll('.price-filter-btn');
    priceBtns.forEach(btn => {
        if (btn.getAttribute('data-price-range') === range) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    applyAllMenuFilters();
}

function applyAllMenuFilters() {
    const query = currentSearchQuery.toLowerCase().trim();
    const emptyMsg = document.getElementById('menu-empty-search');
    const countBadge = document.getElementById('menu-search-count');

    let visibleCount = 0;
    const cards = document.querySelectorAll('.menu-card');

    cards.forEach(card => {
        const name = card.getAttribute('data-name')?.toLowerCase() || '';
        const cat = card.getAttribute('data-category') || '';
        const diet = card.getAttribute('data-dietary') || '';
        const price = parseInt(card.getAttribute('data-price') || '0', 10);
        const desc = card.getAttribute('data-desc')?.toLowerCase() || '';

        // 1. Match Query
        const matchQuery = !query || name.includes(query) || desc.includes(query) || cat.includes(query);

        // 2. Match Category
        let matchCat = (currentFilterCategory === 'all');
        if (currentFilterCategory === 'halal') matchCat = (diet === 'halal');
        else if (currentFilterCategory === 'nonhalal') matchCat = (diet === 'non-halal');
        else if (currentFilterCategory === 'utama' || currentFilterCategory === 'minuman') matchCat = (cat === currentFilterCategory);

        // 3. Match Price
        let matchPrice = true;
        if (currentPriceFilter === 'under25') matchPrice = (price < 25000);
        else if (currentPriceFilter === '25to35') matchPrice = (price >= 25000 && price <= 35000);
        else if (currentPriceFilter === 'above35') matchPrice = (price > 35000);

        if (matchQuery && matchCat && matchPrice) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (emptyMsg) {
        emptyMsg.style.display = (visibleCount === 0) ? 'flex' : 'none';
    }
    if (countBadge) {
        countBadge.innerText = `${visibleCount} menu tersedia`;
    }
}

/* ==========================================================================
   3. FOOD CUSTOMIZATION & SPICE LEVEL (0 - 5) MODAL
   ========================================================================== */

function handleMenuAddClick(item) {
    openVariantModal(item);
}

function openOrderModal(name, price, image, description) {
    openVariantModal({
        name: name,
        price: price,
        image: image,
        description: description || 'Paket hidangan spesial lengkap Titik Rasa Nusantara.',
        category: 'utama',
        dietary: 'halal'
    });
}

function openVariantModal(item) {
    pendingModalItem = item;
    currentModalQty = 1;

    // Set default spice level: 1 for general food, 0 for Nasi Kuning, or 0 for drinks
    if (item.name.toLowerCase().includes('kuning')) {
        currentModalSpice = 0;
    } else {
        currentModalSpice = 1;
    }

    const modal = document.getElementById('variantModal');
    const titleElem = document.getElementById('var-modal-title');
    const descElem = document.getElementById('var-modal-desc');
    const priceElem = document.getElementById('var-modal-price');
    const imgElem = document.getElementById('var-modal-img');
    const dietTag = document.getElementById('var-modal-dietary');
    const spiceGroup = document.getElementById('var-spice-group');
    const variantGroup = document.getElementById('var-variant-group');
    const selectElem = document.getElementById('var-modal-select');
    const notesElem = document.getElementById('var-modal-notes');
    const qtyElem = document.getElementById('var-modal-qty');

    if (titleElem) titleElem.innerText = item.name;
    if (descElem) descElem.innerText = item.description || '';
    if (priceElem) priceElem.innerText = formatRupiah(item.price);
    if (imgElem) imgElem.src = item.image;
    if (notesElem) notesElem.value = '';
    if (qtyElem) qtyElem.innerText = '1';

    if (dietTag) {
        if (item.dietary === 'non-halal') {
            dietTag.className = 'dietary-badge badge-nonhalal';
            dietTag.innerHTML = '<i data-lucide="flame"></i> NON-HALAL (Dapur Terpisah)';
        } else {
            dietTag.className = 'dietary-badge badge-halal';
            dietTag.innerHTML = '<i data-lucide="check"></i> 100% HALAL (Dapur Halal)';
        }
    }

    // Toggle Spice Level section (Food has spice, Beverages hide spice)
    if (spiceGroup) {
        if (item.category === 'utama') {
            spiceGroup.style.display = 'block';
            selectModalSpiceLevel(currentModalSpice);
        } else {
            spiceGroup.style.display = 'none';
        }
    }

    // Toggle Variant dropdown
    if (variantGroup && selectElem) {
        if (item.variants && item.variants.length > 0) {
            selectElem.innerHTML = item.variants.map(v => `<option value="${v}">${v}</option>`).join('');
            variantGroup.style.display = 'block';
        } else {
            variantGroup.style.display = 'none';
            selectElem.innerHTML = '';
        }
    }

    updateModalConfirmBtnText();

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function selectModalSpiceLevel(level) {
    currentModalSpice = parseInt(level, 10);
    const hiddenInput = document.getElementById('var-selected-spice');
    if (hiddenInput) hiddenInput.value = currentModalSpice;

    const buttons = document.querySelectorAll('.spice-opt-btn');
    buttons.forEach(btn => {
        const btnLevel = parseInt(btn.getAttribute('data-level'), 10);
        if (btnLevel === currentModalSpice) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function changeModalQty(delta) {
    currentModalQty = Math.max(1, currentModalQty + delta);
    const qtyElem = document.getElementById('var-modal-qty');
    if (qtyElem) qtyElem.innerText = currentModalQty;
    updateModalConfirmBtnText();
}

function updateModalConfirmBtnText() {
    const btnText = document.getElementById('var-modal-btn-text');
    if (btnText && pendingModalItem) {
        const total = pendingModalItem.price * currentModalQty;
        btnText.innerText = `Tambah ke Keranjang • ${formatRupiah(total)}`;
    }
}

function closeVariantModal() {
    const modal = document.getElementById('variantModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    pendingModalItem = null;
}

function confirmVariantAddToCart() {
    if (!pendingModalItem) return;

    const selectElem = document.getElementById('var-modal-select');
    const notesElem = document.getElementById('var-modal-notes');
    const selectedVariant = (selectElem && pendingModalItem.variants) ? selectElem.value : '';
    const notes = notesElem ? notesElem.value.trim() : '';

    const isFood = (pendingModalItem.category === 'utama');
    const spiceConfig = isFood ? (SPICE_LEVEL_CONFIG[currentModalSpice] || SPICE_LEVEL_CONFIG[1]) : null;

    addToCart({
        name: pendingModalItem.name,
        price: pendingModalItem.price,
        image: pendingModalItem.image,
        category: pendingModalItem.category,
        variant: selectedVariant,
        spiceLevel: isFood ? currentModalSpice : null,
        spiceLabel: spiceConfig ? spiceConfig.label : '',
        spiceIcon: spiceConfig ? spiceConfig.icon : '',
        notes: notes,
        dietary: pendingModalItem.dietary,
        qty: currentModalQty
    });

    closeVariantModal();
}

/* ==========================================================================
   4. MULTI-ITEM SHOPPING CART LOGIC
   ========================================================================== */

function getCart() {
    try {
        const data = localStorage.getItem(STORAGE_CART_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
        updateCartUI();
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function addToCart(newItem) {
    const cart = getCart();

    // Check match including variant and spice level
    const existingIndex = cart.findIndex(i =>
        i.name === newItem.name &&
        (i.variant || '') === (newItem.variant || '') &&
        (i.spiceLevel ?? '') === (newItem.spiceLevel ?? '')
    );

    if (existingIndex > -1) {
        cart[existingIndex].qty += (newItem.qty || 1);
        if (newItem.notes && !cart[existingIndex].notes) {
            cart[existingIndex].notes = newItem.notes;
        }
    } else {
        cart.push({
            id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            name: newItem.name,
            price: newItem.price,
            image: newItem.image,
            category: newItem.category || 'utama',
            variant: newItem.variant || '',
            spiceLevel: newItem.spiceLevel,
            spiceLabel: newItem.spiceLabel || '',
            spiceIcon: newItem.spiceIcon || '',
            notes: newItem.notes || '',
            dietary: newItem.dietary || 'halal',
            qty: newItem.qty || 1
        });
    }

    saveCart(cart);
    const spiceNote = newItem.spiceLabel ? ` (${newItem.spiceLabel})` : '';
    showToast(`✅ <strong>${newItem.name}</strong>${spiceNote} (${newItem.qty} porsi) masuk ke keranjang!`);
}

function updateCartQty(index, change) {
    const cart = getCart();
    if (!cart[index]) return;

    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
        showToast('🗑️ Menu dihapus dari keranjang.');
    }
    saveCart(cart);
}

function removeCartItem(index) {
    const cart = getCart();
    if (!cart[index]) return;
    const removedName = cart[index].name;
    cart.splice(index, 1);
    saveCart(cart);
    showToast(`🗑️ <strong>${removedName}</strong> dihapus.`);
}

function clearCart() {
    const cart = getCart();
    if (cart.length === 0) return;
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh isi keranjang?')) {
        saveCart([]);
        localStorage.removeItem(STORAGE_APPLIED_VOUCHER_KEY);
        showToast('🧹 Keranjang telah dikosongkan.');
    }
}

function getCartSubtotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartTotalCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
    const cart = getCart();
    const count = getCartTotalCount();
    const subtotal = getCartSubtotal();

    // 1. Update Floating Cart Dock
    const cartDock = document.getElementById('floating-cart-dock');
    const badgeCount = document.getElementById('cart-count-badge');
    const dockTotal = document.getElementById('cart-dock-total');

    if (badgeCount) badgeCount.innerText = count;
    if (dockTotal) dockTotal.innerText = formatRupiah(subtotal);

    if (cartDock) {
        if (count > 0) {
            cartDock.classList.add('visible');
        } else {
            cartDock.classList.remove('visible');
        }
    }

    // 2. Update Cart Drawer Count Title
    const drawerCount = document.getElementById('cart-drawer-count');
    if (drawerCount) {
        drawerCount.innerText = count > 0 ? `${count} menu dipilih` : 'Belum ada menu';
    }

    // 3. Render Cart Items inside Drawer
    renderCartDrawerBody();
}

function renderCartDrawerBody() {
    const cart = getCart();
    const drawerBody = document.getElementById('cart-drawer-body');
    const drawerFooter = document.getElementById('cart-drawer-footer');
    if (!drawerBody) return;

    if (cart.length === 0) {
        drawerBody.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon"><i data-lucide="shopping-bag"></i></div>
                <h4>Keranjang Anda Masih Kosong</h4>
                <p>Pilih menu favorit Anda, tentukan Level Pedas 0 s/d 5 sesuai selera, dan nikmati kelezatan Nusantara!</p>
                <button class="btn btn-primary btn-glow" onclick="closeCartDrawer(); window.location.hash='#menu';">
                    <i data-lucide="utensils"></i> Lihat Daftar Menu
                </button>
            </div>
        `;
        if (drawerFooter) drawerFooter.style.display = 'none';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    if (drawerFooter) drawerFooter.style.display = 'block';

    drawerBody.innerHTML = `
        <div class="cart-items-list">
            ${cart.map((item, idx) => {
        let spiceTagHtml = '';
        if (item.spiceLevel !== null && item.spiceLevel !== undefined) {
            spiceTagHtml = `<span class="cart-spice-tag level-${item.spiceLevel}">${item.spiceIcon || '🌶️'} ${item.spiceLabel}</span>`;
        }

        return `
                <div class="cart-item-card">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
                    <div class="cart-item-details">
                        <div class="cart-item-head">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <button class="cart-item-remove" onclick="removeCartItem(${idx})" title="Hapus menu">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                        <div class="cart-item-meta">
                            <span class="cart-diet-tag ${item.dietary === 'non-halal' ? 'tag-nonhalal' : 'tag-halal'}">
                                ${item.dietary === 'non-halal' ? 'Non-Halal' : '100% Halal'}
                            </span>
                            ${spiceTagHtml}
                            ${item.variant ? `<span class="cart-variant-tag"><i data-lucide="check"></i> ${item.variant}</span>` : ''}
                        </div>
                        ${item.notes ? `<div class="cart-item-note"><i data-lucide="file-text"></i> Catatan: ${item.notes}</div>` : ''}
                        <div class="cart-item-bottom">
                            <span class="cart-item-price">${formatRupiah(item.price)}</span>
                            <div class="cart-qty-control">
                                <button class="btn-qty" onclick="updateCartQty(${idx}, -1)">-</button>
                                <span class="qty-num">${item.qty}</span>
                                <button class="btn-qty" onclick="updateCartQty(${idx}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;

    renderCartFooterCalculations();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderCartFooterCalculations() {
    const subtotal = getCartSubtotal();
    const appliedCode = localStorage.getItem(STORAGE_APPLIED_VOUCHER_KEY) || '';
    const voucherData = VOUCHERS[appliedCode];
    let discountAmount = 0;

    const voucherMsgElem = document.getElementById('cart-voucher-status');
    const voucherInput = document.getElementById('cart-voucher-input');

    if (voucherInput && appliedCode) {
        voucherInput.value = appliedCode;
    }

    if (voucherData) {
        if (subtotal >= voucherData.minSpend) {
            discountAmount = voucherData.discount;
            if (voucherMsgElem) {
                voucherMsgElem.className = 'cart-voucher-status success';
                voucherMsgElem.innerHTML = `<i data-lucide="check-circle-2"></i> Voucher <strong>${appliedCode}</strong> aktif: Potongan ${formatRupiah(discountAmount)}`;
                voucherMsgElem.style.display = 'flex';
            }
        } else {
            discountAmount = 0;
            if (voucherMsgElem) {
                voucherMsgElem.className = 'cart-voucher-status error';
                voucherMsgElem.innerHTML = `<i data-lucide="alert-triangle"></i> Min. belanja untuk ${appliedCode} adalah ${formatRupiah(voucherData.minSpend)}.`;
                voucherMsgElem.style.display = 'flex';
            }
        }
    } else if (voucherMsgElem && !appliedCode) {
        voucherMsgElem.style.display = 'none';
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    const subtotalElem = document.getElementById('cart-summary-subtotal');
    const discountRow = document.getElementById('cart-discount-row');
    const discountValElem = document.getElementById('cart-summary-discount');
    const totalElem = document.getElementById('cart-summary-total');

    if (subtotalElem) subtotalElem.innerText = formatRupiah(subtotal);

    if (discountRow && discountValElem) {
        if (discountAmount > 0) {
            discountRow.style.display = 'flex';
            discountValElem.innerText = `- ${formatRupiah(discountAmount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    if (totalElem) totalElem.innerText = formatRupiah(finalTotal);
}

function applyVoucherInCart() {
    const input = document.getElementById('cart-voucher-input');
    const msgElem = document.getElementById('cart-voucher-status');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    const user = getActiveUser();
    const subtotal = getCartSubtotal();

    if (!code) {
        localStorage.removeItem(STORAGE_APPLIED_VOUCHER_KEY);
        if (msgElem) msgElem.style.display = 'none';
        renderCartFooterCalculations();
        return;
    }

    const voucherData = VOUCHERS[code];
    if (!voucherData) {
        localStorage.removeItem(STORAGE_APPLIED_VOUCHER_KEY);
        if (msgElem) {
            msgElem.className = 'cart-voucher-status error';
            msgElem.innerHTML = '<i data-lucide="x-circle"></i> Kode voucher tidak valid.';
            msgElem.style.display = 'flex';
        }
        renderCartFooterCalculations();
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    if (subtotal < voucherData.minSpend) {
        localStorage.removeItem(STORAGE_APPLIED_VOUCHER_KEY);
        if (msgElem) {
            msgElem.className = 'cart-voucher-status error';
            msgElem.innerHTML = `<i data-lucide="alert-triangle"></i> Minimal belanja ${formatRupiah(voucherData.minSpend)} untuk gunakan voucher ini.`;
            msgElem.style.display = 'flex';
        }
        renderCartFooterCalculations();
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    if (voucherData.pointsCost > 0) {
        if (!user) {
            if (confirm(`Voucher ${code} memerlukan ${voucherData.pointsCost.toLocaleString('id-ID')} Titik Poin Member.\n\nApakah Anda ingin Masuk / Daftar Akun untuk mendapatkan 25.000 Titik Poin gratis?`)) {
                window.location.href = '../login/login.html';
            }
            return;
        }
        if (user.points < voucherData.pointsCost) {
            alert(`Saldo poin Anda (${user.points.toLocaleString('id-ID')} Poin) tidak mencukupi untuk voucher ini (${voucherData.pointsCost.toLocaleString('id-ID')} Poin).`);
            return;
        }
    }

    localStorage.setItem(STORAGE_APPLIED_VOUCHER_KEY, code);
    renderCartFooterCalculations();
    showToast(`🎉 Voucher <strong>${code}</strong> berhasil digunakan!`);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (drawer && backdrop) {
        const user = getActiveUser();
        const nameInput = document.getElementById('cart-customer-name');
        const phoneInput = document.getElementById('cart-customer-phone');
        const guestHint = document.getElementById('cart-guest-login-hint');
        const locationInput = document.getElementById('cart-location-input');

        if (user) {
            if (nameInput) { nameInput.value = user.name; }
            if (phoneInput) { phoneInput.value = user.phone; }
            if (guestHint) { guestHint.style.display = 'none'; }
        } else {
            if (guestHint) { guestHint.style.display = 'block'; }
        }

        if (currentTableNum && locationInput && !locationInput.value) {
            locationInput.value = `Meja No. ${currentTableNum}`;
        }

        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCartDrawerBody();
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (drawer && backdrop) {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   5. SEND MULTI-ITEM WHATSAPP ORDER (WITH SPICE LEVELS & PAYMENT METHOD)
   ========================================================================== */

function sendWhatsAppCartOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong!');
        return;
    }

    const user = getActiveUser();
    const nameInput = document.getElementById('cart-customer-name');
    const phoneInput = document.getElementById('cart-customer-phone');
    const orderTypeElem = document.getElementById('cart-order-type');
    const locationElem = document.getElementById('cart-location-input');
    const paymentMethodElem = document.getElementById('cart-payment-method');
    const generalNotesElem = document.getElementById('cart-general-notes');

    const customerName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : (user ? user.name : 'Tamu Titik Rasa');
    const customerPhone = (phoneInput && phoneInput.value.trim()) ? phoneInput.value.trim() : (user ? user.phone : '-');
    const orderType = orderTypeElem ? orderTypeElem.value : 'Makan di Tempat (Dine In)';
    const locationInfo = (locationElem && locationElem.value.trim()) ? locationElem.value.trim() : (currentTableNum ? `Meja No. ${currentTableNum}` : 'Tidak diisi');
    const paymentMethod = paymentMethodElem ? paymentMethodElem.value : 'QRIS Instan (BCA / E-Wallet)';
    const generalNotes = (generalNotesElem && generalNotesElem.value.trim()) ? generalNotesElem.value.trim() : '-';

    const subtotal = getCartSubtotal();
    const appliedCode = localStorage.getItem(STORAGE_APPLIED_VOUCHER_KEY) || '';
    const voucherData = VOUCHERS[appliedCode];
    let discountAmount = 0;

    if (voucherData && subtotal >= voucherData.minSpend) {
        discountAmount = voucherData.discount;
        if (user && voucherData.pointsCost > 0 && user.points >= voucherData.pointsCost) {
            user.points -= voucherData.pointsCost;
            const db = getUsersDB();
            db[user.phone].points = user.points;
            saveUsersDB(db);
            syncUserUI(user);
        }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    let itemsText = '';
    cart.forEach((item, i) => {
        const variantText = item.variant ? ` • ${item.variant}` : '';
        const spiceText = (item.spiceLevel !== null && item.spiceLevel !== undefined) ? ` • ${item.spiceLabel}` : '';
        const noteText = item.notes ? `\n   ↳ Catatan: _${item.notes}_` : '';
        const dietSymbol = item.dietary === 'non-halal' ? ' [Non-Halal/Dapur Terpisah]' : ' [Halal]';
        itemsText += `${i + 1}. *${item.name}* (${dietSymbol.trim()}${variantText}${spiceText})\n   ${item.qty}x @ ${formatRupiah(item.price)} = *${formatRupiah(item.price * item.qty)}*${noteText}\n`;
    });

    let discountInfo = '';
    if (discountAmount > 0) {
        discountInfo = `• *Diskon Voucher (${appliedCode}):* -${formatRupiah(discountAmount)}\n`;
    }

    const message = `*HALO TITIK RASA, SAYA INGIN PESAN!* 🍽️\n\n` +
        `📋 *RINCIAN PESANAN:* \n${itemsText}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `• *Subtotal Pesanan:* ${formatRupiah(subtotal)}\n` +
        discountInfo +
        `• *TOTAL PEMBAYARAN:* *${formatRupiah(finalTotal)}*\n` +
        `• *Metode Pembayaran:* ${paymentMethod}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *DATA PEMESAN:*\n` +
        `• *Nama:* ${customerName}\n` +
        `• *No. WhatsApp:* ${customerPhone}\n` +
        `• *Tipe Pesanan:* ${orderType}\n` +
        `• *Meja / Alamat:* ${locationInfo}\n` +
        `• *Catatan Tambahan:* ${generalNotes}\n\n` +
        `_Jaminan: Seluruh pesanan dimasak higienis di 2 Dapur Terpisah (Halal & Non-Halal)._\n\n` +
        `Mohon segera diproses pesanan saya. Terima kasih! 🙏`;

    const whatsappUrl = `https://wa.me/6285137756784?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeCartDrawer();
}

/* ==========================================================================
   6. INTERACTIVE TABLE RESERVATION & DIGITAL BOOKING PASS
   ========================================================================== */

function handleReservationSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('res-name').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const area = document.getElementById('res-area').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const guests = document.getElementById('res-guests').value;
    const notes = document.getElementById('res-notes').value.trim() || 'Tidak ada catatan khusus';

    const bookingCode = 'TR-RES-' + Math.floor(1000 + Math.random() * 9000);

    // Populate Booking Pass Modal
    const codeElem = document.getElementById('pass-code');
    const nameElem = document.getElementById('pass-name');
    const phoneElem = document.getElementById('pass-phone');
    const areaElem = document.getElementById('pass-area');
    const datetimeElem = document.getElementById('pass-datetime');
    const guestsElem = document.getElementById('pass-guests');
    const notesElem = document.getElementById('pass-notes');

    if (codeElem) codeElem.innerText = bookingCode;
    if (nameElem) nameElem.innerText = name;
    if (phoneElem) phoneElem.innerText = phone;
    if (areaElem) areaElem.innerText = area;
    if (datetimeElem) datetimeElem.innerText = `${date} • Pukul ${time} WIB`;
    if (guestsElem) guestsElem.innerText = `${guests} Orang`;
    if (notesElem) notesElem.innerText = notes;

    const confirmBtn = document.getElementById('btn-confirm-pass-wa');
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            const message = `*KONFIRMASI RESERVASI MEJA TITIK RASA* 🏛️\n\n` +
                `• *Kode Booking:* *${bookingCode}*\n` +
                `• *Nama Pemesan:* ${name}\n` +
                `• *No. WhatsApp:* ${phone}\n` +
                `• *Pilihan Area:* ${area}\n` +
                `• *Jadwal Kedatangan:* ${date}, ${time} WIB\n` +
                `• *Jumlah Tamu:* ${guests} Orang\n` +
                `• *Catatan Tambahan:* ${notes}\n\n` +
                `Mohon konfirmasi kesiapan meja kami. Terima kasih! 🙏`;

            const whatsappUrl = `https://wa.me/6285137756784?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            closeBookingPassModal();
        };
    }

    openBookingPassModal();
}

function openBookingPassModal() {
    const modal = document.getElementById('bookingPassModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBookingPassModal() {
    const modal = document.getElementById('bookingPassModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   7. INTERACTIVE CUSTOMER REVIEWS & POINT REWARDS (+500 POINTS)
   ========================================================================== */

function getReviews() {
    try {
        const data = localStorage.getItem(STORAGE_REVIEWS_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(DEFAULT_REVIEWS));
            return DEFAULT_REVIEWS;
        }
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_REVIEWS;
    }
}

function saveReviews(reviews) {
    try {
        localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
        console.error('Error saving reviews:', e);
    }
}

function renderReviewsList() {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    const reviews = getReviews();

    container.innerHTML = reviews.map(rev => {
        const starsHtml = Array.from({ length: 5 }, (_, i) =>
            `<i data-lucide="star" class="${i < rev.rating ? 'star-filled' : 'star-empty'}" fill="${i < rev.rating ? 'currentColor' : 'none'}"></i>`
        ).join('');

        return `
        <div class="review-card-modern">
            <div class="review-card-header">
                <div class="reviewer-avatar">${rev.name.charAt(0).toUpperCase()}</div>
                <div class="reviewer-info">
                    <h4 class="reviewer-name">${rev.name}</h4>
                    <span class="review-date">${rev.date}</span>
                </div>
                ${rev.verified ? `<span class="review-verified-badge" title="Tamu Terverifikasi"><i data-lucide="check-circle-2"></i> Tamu Terverifikasi</span>` : ''}
            </div>
            <div class="review-dish-tag">
                <i data-lucide="utensils"></i> Menu Favorit: <strong>${rev.dish}</strong>
            </div>
            <div class="review-stars-row">
                ${starsHtml}
                <span class="review-score-num">${rev.rating}.0</span>
            </div>
            <p class="review-comment-text">“${rev.comment}”</p>
        </div>
        `;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openReviewModal() {
    const user = getActiveUser();
    const nameInput = document.getElementById('rev-input-name');
    const dishSelect = document.getElementById('rev-input-dish');

    if (nameInput && user) {
        nameInput.value = user.name;
    }

    if (dishSelect) {
        dishSelect.innerHTML = MENU_ITEMS.map(([name]) => `<option value="${name}">${name}</option>`).join('');
    }

    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function setStarRatingInput(val) {
    const ratingInput = document.getElementById('rev-star-rating');
    if (ratingInput) ratingInput.value = val;

    const stars = document.querySelectorAll('.star-picker-btn');
    stars.forEach((btn, idx) => {
        if (idx < val) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function submitCustomerReview(event) {
    event.preventDefault();
    const user = getActiveUser();
    const nameInput = document.getElementById('rev-input-name');
    const dishInput = document.getElementById('rev-input-dish');
    const commentInput = document.getElementById('rev-input-text');
    const ratingInput = document.getElementById('rev-star-rating');

    const name = nameInput.value.trim();
    const dish = dishInput.value;
    const comment = commentInput.value.trim();
    const ratingVal = parseInt(ratingInput?.value || '5', 10);

    if (!name || !comment) {
        alert('Silakan lengkapi nama dan ulasan Anda.');
        return;
    }

    const newReview = {
        id: 'rev_' + Date.now(),
        name: name,
        date: 'Baru saja',
        rating: ratingVal,
        dish: dish,
        comment: comment,
        verified: true
    };

    const reviews = getReviews();
    reviews.unshift(newReview);
    saveReviews(reviews);

    // Award +500 points if logged in
    let pointRewardText = '';
    if (user) {
        user.points = (user.points || 0) + 500;
        const db = getUsersDB();
        if (db[user.phone]) {
            db[user.phone].points = user.points;
            saveUsersDB(db);
            syncUserUI(user);
        }
        pointRewardText = ` & Anda mendapatkan bonus <strong>+500 Titik Poin</strong>!`;
    }

    renderReviewsList();
    closeReviewModal();
    showToast(`🎉 Terima kasih <strong>${name}</strong>! Ulasan Anda telah diterbitkan${pointRewardText}`);
}

/* ==========================================================================
   8. QRIS & DIGITAL PAYMENT SIMULATION
   ========================================================================== */

function openQrisModal() {
    const subtotal = getCartSubtotal();
    const appliedCode = localStorage.getItem(STORAGE_APPLIED_VOUCHER_KEY) || '';
    const voucherData = VOUCHERS[appliedCode];
    let discountAmount = 0;
    if (voucherData && subtotal >= voucherData.minSpend) {
        discountAmount = voucherData.discount;
    }
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const qrisAmountElem = document.getElementById('qris-modal-amount');
    if (qrisAmountElem) {
        qrisAmountElem.innerText = formatRupiah(finalTotal);
    }

    const modal = document.getElementById('qrisModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeQrisModal() {
    const modal = document.getElementById('qrisModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function copyBankNumber(accNumber) {
    navigator.clipboard.writeText(accNumber).then(() => {
        showToast(`📋 Nomor Rekening <strong>${accNumber}</strong> berhasil disalin!`);
    }).catch(() => {
        showToast(`📋 Nomor Rekening: <strong>${accNumber}</strong>`);
    });
}

/* ==========================================================================
   9. DATABASE & USER STATE MANAGERS
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
    window.location.reload();
}

function syncUserUI(user) {
    const memberBar = document.getElementById('member-profile-bar');
    const guestBar = document.getElementById('guest-profile-bar');
    const barName = document.getElementById('bar-user-name');
    const barPhone = document.getElementById('bar-user-phone');
    const barPoints = document.getElementById('bar-user-points');

    const drawerUser = document.getElementById('drawer-user-info');
    const drawerGuest = document.getElementById('drawer-guest-info');
    const drawerName = document.getElementById('drawer-user-name');
    const drawerPhone = document.getElementById('drawer-user-phone');
    const drawerPoints = document.getElementById('drawer-user-points');

    const dashName = document.getElementById('dash-user-name');
    const dashPhone = document.getElementById('dash-user-phone');
    const pointsVal = document.getElementById('user-points-val');
    const checkPhone = document.getElementById('check-points-phone');
    const checkStatus = document.getElementById('check-points-status');
    const dashGuestBanner = document.getElementById('dash-guest-banner');

    if (user) {
        if (memberBar) memberBar.style.display = 'inline-flex';
        if (guestBar) guestBar.style.display = 'none';
        if (barName) barName.innerText = user.name;
        if (barPhone) barPhone.innerText = user.phone;
        if (barPoints) barPoints.innerText = user.points.toLocaleString('id-ID');

        if (drawerUser) drawerUser.style.display = 'flex';
        if (drawerGuest) drawerGuest.style.display = 'none';
        if (drawerName) drawerName.innerText = user.name;
        if (drawerPhone) drawerPhone.innerText = user.phone;
        if (drawerPoints) drawerPoints.innerText = user.points.toLocaleString('id-ID');

        if (dashName) dashName.innerText = user.name;
        if (dashPhone) dashPhone.innerText = user.phone;
        if (pointsVal) pointsVal.innerText = user.points.toLocaleString('id-ID');
        if (checkPhone) checkPhone.value = user.phone;
        if (dashGuestBanner) dashGuestBanner.style.display = 'none';

        if (checkStatus) {
            checkStatus.style.display = 'flex';
            checkStatus.innerHTML = `<i data-lucide="check-circle-2"></i> Akun Member <strong>${user.name}</strong> (${user.phone}) aktif! Saldo: <strong>${user.points.toLocaleString('id-ID')} Poin</strong>`;
        }
    } else {
        if (memberBar) memberBar.style.display = 'none';
        if (guestBar) guestBar.style.display = 'inline-flex';

        if (drawerUser) drawerUser.style.display = 'none';
        if (drawerGuest) drawerGuest.style.display = 'flex';

        if (dashName) dashName.innerText = 'Mode Tamu';
        if (dashPhone) dashPhone.innerText = 'Belum Masuk Akun';
        if (pointsVal) pointsVal.innerText = '0';
        if (checkPhone) checkPhone.value = '';
        if (dashGuestBanner) dashGuestBanner.style.display = 'block';

        if (checkStatus) {
            checkStatus.style.display = 'none';
        }
    }

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
            statusMsg.innerHTML = `<i data-lucide="info"></i> Nomor <strong>${searchPhone}</strong> belum terdaftar. Silakan daftar untuk klaim 25.000 Poin!`;
        }
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function claimVoucherDirect(code, discountVal, pointsCost, minSpend) {
    const user = getActiveUser();
    if (!user) {
        if (confirm(`Halo Penikmat Kuliner!\n\nVoucher ${code} bernilai ${formatRupiah(discountVal)} ini khusus untuk Member Titik Rasa.\n\nApakah Anda ingin Masuk / Daftar Akun sekarang untuk langsung klaim 25.000 Titik Poin Selamat Datang?`)) {
            window.location.href = '../login/login.html';
        }
        return;
    }

    if (user.points < pointsCost) {
        alert(`Maaf ${user.name}, saldo Titik Poin Anda (${user.points.toLocaleString('id-ID')} Poin) belum mencukupi untuk menukar voucher ini (${pointsCost.toLocaleString('id-ID')} Poin).`);
        return;
    }

    localStorage.setItem(STORAGE_APPLIED_VOUCHER_KEY, code);
    showToast(`🎉 Voucher <strong>${code}</strong> berhasil diaktifkan untuk pesanan Anda!`);
    openCartDrawer();
}

/* ==========================================================================
   10. UTILITIES & TOAST
   ========================================================================== */

function showToast(htmlMessage) {
    let toast = document.getElementById('titikrasa-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'titikrasa-toast';
        toast.className = 'titikrasa-toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = htmlMessage;
    toast.classList.add('show');

    if (typeof lucide !== 'undefined') lucide.createIcons();

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function formatRupiah(amount) {
    return 'Rp ' + (amount || 0).toLocaleString('id-ID');
}

/* ==========================================================================
   11. MOBILE DRAWER & NAVIGATION CONTROLLER
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
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   12. INITIALIZATION ON DOM LOAD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sync User UI
    syncUserUI(getActiveUser());

    // 2. Check Table QR Auto-detect
    checkTableQrParam();

    // 3. Render Dynamic Menu Items
    renderMenuItems();

    // 4. Render Dynamic Customer Reviews
    renderReviewsList();

    // 5. Update Cart State
    updateCartUI();

    // 6. Set default Date in Reservation Form (Today + 1 day)
    const resDateInput = document.getElementById('res-date');
    if (resDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        resDateInput.value = tomorrow.toISOString().split('T')[0];
        resDateInput.min = new Date().toISOString().split('T')[0];
    }

    // 7. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 8. Mobile Drawer Listeners
    const mobileToggle = document.getElementById('mobile-toggle');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);

    // 9. Keyboard ESC listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileDrawer();
            closeCartDrawer();
            closeVariantModal();
            closeSupportModal();
            closeReviewModal();
            closeBookingPassModal();
            closeQrisModal();
            closeTableSimulatorModal();
        }
    });

    // 10. Scroll Events (Navbar Morph, Reading Progress Bar, Scrollspy)
    const navbarWrapper = document.getElementById('navbar-wrapper');
    const scrollProgressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('header[id], section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (navbarWrapper) {
            if (scrollY > 30) {
                navbarWrapper.classList.add('navbar-scrolled');
            } else {
                navbarWrapper.classList.remove('navbar-scrolled');
            }
        }

        if (scrollProgressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const scrollPercent = (scrollY / docHeight) * 100;
                scrollProgressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
            }
        }

        let currentSectionId = '';
        const scrollPosition = scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        drawerLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 11. Category Filter Buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterMenuCategory(category);
        });
    });
});

// ============================================================
// 1. БАЗА ПЕРЕВОДОВ (Убрана надпись 200 шт.)
// ============================================================
const translations = {
    pl: { 
        search: "Szukaj...", hits: "🔥 Hity i Popularne", categories: "☰ Kategorie", buy: "Do koszyka", 
        desc: "Opis", usage: "Użycie", empty: "Koszyk pusty", total: "Razem:", added: "Dodano!",
        cat_face: "🧴 Twarz", cat_mask: "🧖‍♀️ Maski", cat_makeup: "💄 Makijaż", cat_spf: "🌞 SPF", cat_body: "🚿 Ciało", cat_all: "✨ Wszystko",
        cart_title: "🛒 Koszyk", checkout: "Zamów", pay_title: "Płatność", pay_method: "Metoda:", pay_btn: "Zapłać", back_shop: "← Sklep", success: "Opłacono! 🎉"
    },
    en: { 
        search: "Search...", hits: "🔥 Hits & Best Sellers", categories: "☰ Categories", buy: "Add to Cart", 
        desc: "Description", usage: "Usage", empty: "Empty", total: "Total:", added: "Added!",
        cat_face: "🧴 Face", cat_mask: "🧖‍♀️ Masks", cat_makeup: "💄 Makeup", cat_spf: "🌞 SPF", cat_body: "🚿 Body", cat_all: "✨ All",
        cart_title: "🛒 Cart", checkout: "Checkout", pay_title: "Payment", pay_method: "Method:", pay_btn: "Pay", back_shop: "← Shop", success: "Success! 🎉"
    },
    ua: { 
        search: "Пошук...", hits: "🔥 Хіти та Популярне", categories: "☰ Категорії", buy: "В кошик", 
        desc: "Опис", usage: "Застосування", empty: "Порожньо", total: "Разом:", added: "Додано!",
        cat_face: "🧴 Обличчя", cat_mask: "🧖‍♀️ Маски", cat_makeup: "💄 Макіяж", cat_spf: "🌞 SPF", cat_body: "🚿 Тіло", cat_all: "✨ Все",
        cart_title: "🛒 Кошик", checkout: "Оформити", pay_title: "Оплата", pay_method: "Метод:", pay_btn: "Сплатити", back_shop: "← Магазин", success: "Сплачено! 🎉"
    },
    ru: { 
        search: "Поиск...", hits: "🔥 Хиты и Популярное", categories: "☰ Категории", buy: "В корзину", 
        desc: "Описание", usage: "Применение", empty: "Пусто", total: "Итого:", added: "Добавлено!",
        cat_face: "🧴 Лицо", cat_mask: "🧖‍♀️ Маски", cat_makeup: "💄 Макияж", cat_spf: "🌞 SPF", cat_body: "🚿 Тело", cat_all: "✨ Все",
        cart_title: "🛒 Корзина", checkout: "Оформить", pay_title: "Оплата", pay_method: "Метод:", pay_btn: "Оплатить", back_shop: "← Магазин", success: "Оплачено! 🎉"
    }
};

// ============================================================
// 2. ГЕНЕРАТОР ТОВАРОВ (Убрана нумерация No.i)
// ============================================================
const products = [];
const brands = ["COSRX", "Innisfree", "Missha", "Holika Holika", "Laneige", "Dr.Jart+"];
const types = [
    {id: 'face', pl: 'Krem', en: 'Cream', ua: 'Крем', ru: 'Крем', price: 700},
    {id: 'mask', pl: 'Maska', en: 'Mask', ua: 'Маска', ru: 'Маска', price: 60},
    {id: 'makeup', pl: 'Tint', en: 'Tint', ua: 'Тінт', ru: 'Тинт', price: 350},
    {id: 'spf', pl: 'SPF 50+', en: 'SPF 50+', ua: 'SPF 50+', ru: 'SPF 50+', price: 900}
];

for (let i = 1; i <= 200; i++) {
    let brand = brands[i % brands.length];
    let type = types[i % types.length];
    products.push({
        id: i,
        cat: type.id,
        price: type.price + (i % 50),
        img: `https://via.placeholder.com/200?text=${brand}+Product`,
        title_pl: `${brand} ${type.pl}`,
        title_en: `${brand} ${type.en}`,
        title_ua: `${brand} ${type.ua}`,
        title_ru: `${brand} ${type.ru}`,
        desc_pl: "Wysokiej jakości produkt koreański.", desc_en: "High quality Korean product.",
        desc_ua: "Високоякісний корейський продукт.", desc_ru: "Высококачественный корейский продукт.",
        use_pl: "Stosować на czystą skórę.", use_en: "Apply to clean skin.",
        use_ua: "Наносити на чисту шкіру.", use_ru: "Наносить на чистую кожу."
    });
}



// ============================================================
// 3. ЛОГИКА МАГАЗИНА (ПАГИНАЦИЯ + ПОИСК)
// ============================================================
let cart = [];
let currentLang = localStorage.getItem('site_lang') || 'pl';
let currentPage = 1;
const itemsPerPage = 50;
let filteredProducts = [...products];

document.addEventListener("DOMContentLoaded", () => {
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) langSwitcher.value = currentLang;
    renderAll();
    updateText();
});

function renderAll() {
    renderProducts();
    renderPagination();
}

function renderProducts() {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = "";
    const t = translations[currentLang];

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = filteredProducts.slice(start, end);

    itemsToShow.forEach(p => {
        const title = p[`title_${currentLang}`];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div onclick="showProductDetails(${p.id})">
                <img src="${p.img}" alt="${title}">
                <h3>${title}</h3>
                <p class="price">${p.price} ₴</p>
            </div>
            <button class="btn-buy" onclick="addToCart(${p.id})">${t.buy}</button>
        `;
        container.appendChild(card);
    });
}

function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    container.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => {
            currentPage = i;
            renderAll();
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
        container.appendChild(btn);
    }

function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const langKey = `title_${currentLang}`; // Ищем по названию на текущем языке

    if (query === "") {
        // Если поиск пустой — показываем все товары
        filteredProducts = [...products];
    } else {
        // Фильтруем основной массив товаров
        filteredProducts = products.filter(p => {
            const title = p[langKey] ? p[langKey].toLowerCase() : "";
            return title.includes(query);
        });
    }

    // Сбрасываем на 1 страницу и перерисовываем
    currentPage = 1;
    renderAll();

    // Опционально: если ничего не найдено, выводим сообщение
    const container = document.getElementById('product-list');
    if (filteredProducts.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Ничего не найдено 🔍</p>`;
    }
}

function filterByCategory(cat) {
    if (cat === 'all') filteredProducts = [...products];
    else filteredProducts = products.filter(p => p.cat === cat);
    currentPage = 1;
    renderAll();
    closeModal('category-modal');
}

// --- КОРЗИНА И МОДАЛКИ (ТВОИ ФУНКЦИИ) ---

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.length;
}

function openCart() {
    renderCart();
    openModal('cart-modal');
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    if (!container) return;
    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px;">${translations[currentLang].empty}</p>`;
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            container.innerHTML += `
                <div class="cart-item">
                    <span>${item[`title_${currentLang}`]}</span>
                    <b>${item.price} ₴</b>
                    <button class="btn-remove" onclick="removeFromCart(${index})">&times;</button>
                </div>`;
        });
    }
    totalEl.innerText = total + " ₴";
    localStorage.setItem('cartTotal', total);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);
    updateText();
    renderAll();
}

function updateText() {
    const t = translations[currentLang];
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.search;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
}

function showProductDetails(id) {
    const p = products.find(prod => prod.id === id);
    const modalBody = document.getElementById('modal-body');
    const t = translations[currentLang];
    
    modalBody.innerHTML = `
        <div style="text-align:center">
            <img src="${p.img}" style="width:150px; border-radius:10px;">
            <h2>${p[`title_${currentLang}`]}</h2>
            <h3 class="price">${p.price} ₴</h3>
        </div>
        <p><strong>${t.desc}:</strong> ${p[`desc_${currentLang}`]}</p>
        <p><strong>${t.usage}:</strong> ${p[`use_${currentLang}`]}</p>
        <button class="btn-main" style="width:100%; margin-top:15px" onclick="addToCart(${p.id}); closeModal('product-modal')">${t.buy}</button>
    `;
    openModal('product-modal');
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function goToPayment() { if (cart.length > 0) window.location.href = "payment.html"; }


window.onclick = function(e) { if (e.target.classList.contains('modal')) e.target.style.display = "none"; }


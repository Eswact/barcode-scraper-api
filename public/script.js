/* ========== I18N ========== */

const TRANSLATIONS = {
    tr: {
        'status.waiting':    'Bekleniyor',
        'status.searching':  'Aranıyor...',
        'status.done':       'Tamamlandı',
        'status.error':      'Hata',
        'tab.prices':        'Fiyat Karşılaştırma',
        'tab.products':      'Ürün Bilgisi',
        'input.title':       'Barkod Gir',
        'input.hint':        'GTIN, EAN, UPC desteklenir',
        'input.placeholder': 'Barkod numaralarını her satıra bir tane girin...\n\nÖrnek:\n8690504085720\n8690632994055',
        'btn.clear':         'Temizle',
        'btn.shortcut':      'Ctrl+Enter ile ara',
        'btn.searchPrices':  'Fiyat Ara',
        'btn.searchProducts':'Ürün Ara',
        'prices.title':      'Fiyat Karşılaştırma',
        'prices.subtitle':   '7 markette fiyatları gerçek zamanlı karşılaştırın. Redis cache ile hızlandırılmıştır.',
        'products.title':    'Ürün Bilgisi',
        'products.subtitle': 'Barkodan ürün adı, görseli, fiyatı ve kategori bilgisini çekin. İlk bulan kazanır.',
        'loading.init':      'Başlatılıyor...',
        'results.title':     'Tarama Sonuçları',
        'empty.prices.title':       'Fiyat Karşılaştırma',
        'empty.prices.text':        'Barkodları girerek 7 markette aynı anda fiyat karşılaştırması yapın. En ucuz fiyat otomatik vurgulanır.',
        'empty.prices.feat1.title': 'Hızlı Mod',
        'empty.prices.feat1.text':  'Platform başına tek tab, paralel tarama.',
        'empty.prices.feat2.title': 'Redis Cache',
        'empty.prices.feat2.text':  '24 saat önbellek ile anında sonuç.',
        'empty.prices.feat3.title': 'CSV Dışa Aktarma',
        'empty.prices.feat3.text':  "Sonuçları Excel'e aktarın.",
        'empty.products.title':       'Ürün Bilgisi',
        'empty.products.text':        'Barkodları girerek ürün adı, görseli, fiyatı ve kategori yolu bilgisini çekin. Sonuçlar dosyaya da kaydedilir.',
        'empty.products.feat1.title': 'Ürün Görseli',
        'empty.products.feat1.text':  'Gerçek ürün fotoğrafını çeker.',
        'empty.products.feat2.title': 'Kategori Yolu',
        'empty.products.feat2.text':  'Breadcrumb ile tam kategori bilgisi.',
        'empty.products.feat3.title': 'Dosyaya Kaydet',
        'empty.products.feat3.text':  "output/product-list.json'a kaydedilir.",
        'tabs.locked':       'Tarama devam ediyor...',
        'lang.toggle':       'images/gb.png',
        'cell.best':         'En Ucuz',
        'cell.notFound':     'Bulunamadı',
        'badge.found':       'Bulundu',
        'badge.loading':     'Aranıyor...',
        'badge.notFound':    'Bulunamadı',
        'status.allFound':   'Tümünde Bulundu',
        'status.noneFound':  'Hiçbir Yerde Bulunamadı',
        'summary.title':     'Özet Tablo',
        'summary.btn':       'CSV İndir',
        'col.barcode':       'Barkod',
        'col.lowest':        'En Düşük',
        'col.highest':       'En Yüksek',
        'col.bestMarket':    'En İyi Market',
        'col.status':        'Durum',
        'col.platform':      'Platform',
        'col.productName':   'Ürün Adı',
        'col.price':         'Fiyat',
        'csv.prices.prefix':   'fiyat_karsilastirma',
        'csv.products.prefix': 'urun_sonuclar',
        'alert.noBarcodes':  'Lütfen en az bir barkod girin!',
        'alert.noData':      'Henüz dışa aktarılacak veri yok!',
        'alert.noDataProd':  'Henüz veri yok!',
        'err.server':        'Sunucunun çalıştığından emin olun: <code>node server.js</code>',
        // function values
        'search.starting':   (n, p) => `${n} barkod, ${p} platformda aranıyor...`,
        'search.progress':   (c, total) => `${c}/${total} barkod tamamlandı`,
        'count.progress':    (c, total) => `${c} / ${total} barkod tamamlandı`,
        'badge.searching':   (found, rem) => `${found} bulundu · ${rem} bekleniyor...`,
        'badge.partial':     (found, total) => `${found}/${total} Markette`,
        'summary.products':  (found, nf) => `Özet — ${found} bulundu, ${nf} bulunamadı`,
        'prod.searching':    (n) => `${n} barkod aranıyor...`,
    },
    en: {
        'status.waiting':    'Waiting',
        'status.searching':  'Searching...',
        'status.done':       'Completed',
        'status.error':      'Error',
        'tab.prices':        'Price Comparison',
        'tab.products':      'Product Info',
        'input.title':       'Enter Barcode',
        'input.hint':        'GTIN, EAN, UPC supported',
        'input.placeholder': 'Enter barcode numbers, one per line...\n\nExample:\n8690504085720\n8690632994055',
        'btn.clear':         'Clear',
        'btn.shortcut':      'Ctrl+Enter to search',
        'btn.searchPrices':  'Search Prices',
        'btn.searchProducts':'Search Products',
        'prices.title':      'Price Comparison',
        'prices.subtitle':   'Compare prices across 7 markets in real time. Accelerated with Redis cache.',
        'products.title':    'Product Info',
        'products.subtitle': 'Fetch product name, image, price and category from a barcode. First match wins.',
        'loading.init':      'Initializing...',
        'results.title':     'Scan Results',
        'empty.prices.title':       'Price Comparison',
        'empty.prices.text':        'Enter barcodes to compare prices across 7 markets simultaneously. The cheapest price is highlighted automatically.',
        'empty.prices.feat1.title': 'Fast Mode',
        'empty.prices.feat1.text':  'One tab per platform, parallel scanning.',
        'empty.prices.feat2.title': 'Redis Cache',
        'empty.prices.feat2.text':  'Instant results with 24-hour cache.',
        'empty.prices.feat3.title': 'CSV Export',
        'empty.prices.feat3.text':  'Export results to Excel.',
        'empty.products.title':       'Product Info',
        'empty.products.text':        'Enter barcodes to fetch product name, image, price and category path. Results are also saved to a file.',
        'empty.products.feat1.title': 'Product Image',
        'empty.products.feat1.text':  'Fetches the real product photo.',
        'empty.products.feat2.title': 'Category Path',
        'empty.products.feat2.text':  'Full category info with breadcrumb.',
        'empty.products.feat3.title': 'Save to File',
        'empty.products.feat3.text':  'Saved to output/product-list.json.',
        'tabs.locked':       'Scan in progress...',
        'lang.toggle':       'images/tr.png',
        'cell.best':         'Cheapest',
        'cell.notFound':     'Not Found',
        'badge.found':       'Found',
        'badge.loading':     'Searching...',
        'badge.notFound':    'Not Found',
        'status.allFound':   'Found in All',
        'status.noneFound':  'Not Found Anywhere',
        'summary.title':     'Summary Table',
        'summary.btn':       'Download CSV',
        'col.barcode':       'Barcode',
        'col.lowest':        'Lowest',
        'col.highest':       'Highest',
        'col.bestMarket':    'Best Market',
        'col.status':        'Status',
        'col.platform':      'Platform',
        'col.productName':   'Product Name',
        'col.price':         'Price',
        'csv.prices.prefix':   'price_comparison',
        'csv.products.prefix': 'product_results',
        'alert.noBarcodes':  'Please enter at least one barcode!',
        'alert.noData':      'No data to export yet!',
        'alert.noDataProd':  'No data yet!',
        'err.server':        'Make sure the server is running: <code>node server.js</code>',
        // function values
        'search.starting':   (n, p) => `Searching ${n} barcodes across ${p} platforms...`,
        'search.progress':   (c, total) => `${c}/${total} barcodes completed`,
        'count.progress':    (c, total) => `${c} / ${total} barcodes completed`,
        'badge.searching':   (found, rem) => `${found} found · ${rem} pending...`,
        'badge.partial':     (found, total) => `${found}/${total} Markets`,
        'summary.products':  (found, nf) => `Summary — ${found} found, ${nf} not found`,
        'prod.searching':    (n) => `Searching ${n} barcodes...`,
    }
};

let currentLang = localStorage.getItem('lang') || 'tr';

function t(key, ...args) {
    const val = TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.tr[key];
    return typeof val === 'function' ? val(...args) : (val ?? key);
}

function applyI18n() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPh);
    });
    const flagImg = document.getElementById('langFlagImg');
    if (flagImg) { flagImg.src = t('lang.toggle'); flagImg.alt = currentLang === 'tr' ? 'EN' : 'TR'; }
}

function toggleLang() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('lang', currentLang);
    applyI18n();
}

/* ========== MODE SWITCHER ========== */

let currentMode = 'prices';
let isSearching = false;

function setSearching(active) {
    isSearching = active;
    const tabPrices   = document.getElementById('tab-prices');
    const tabProducts = document.getElementById('tab-products');
    tabPrices.disabled   = active;
    tabProducts.disabled = active;
    const lbl = document.getElementById('tabsLockedLabel');
    if (lbl) {
        lbl.textContent = t('tabs.locked');
        lbl.classList.toggle('visible', active);
    }
}

function switchMode(mode) {
    if (isSearching) return;
    currentMode = mode;
    document.getElementById('tab-prices').classList.toggle('active', mode === 'prices');
    document.getElementById('tab-products').classList.toggle('active', mode === 'products');
    document.getElementById('panel-prices').classList.toggle('active', mode === 'prices');
    document.getElementById('panel-products').classList.toggle('active', mode === 'products');
    resetStatus();
}

function resetStatus() {
    const chip = document.getElementById('statusChip');
    chip.className = 'status-chip';
    document.getElementById('statusLabel').textContent = t('status.waiting');
}

function parseBarcodes(text) {
    return text.split(/[\n,]/).map(b => b.trim()).filter(b => b.length > 0);
}

/* ========== PRICES MODE ========== */

const PRICE_PLATFORMS = ['trendyol', 'hepsiburada', 'pazarama', 'carrefour', 'mopas', 'aftaMarket', 'sokMarket', 'marketKarsilastir'];

const marketConfig = {
    trendyol:          { name: 'Trendyol',         logo: 'images/trendyol.png',          url: 'https://www.trendyol.com/sr?q=' },
    hepsiburada:       { name: 'Hepsiburada',       logo: 'images/hepsiburada.png',       url: 'https://www.hepsiburada.com/ara?q=' },
    pazarama:          { name: 'Pazarama',          logo: 'images/pazarama.png',          url: 'https://www.pazarama.com/arama?q=' },
    carrefour:         { name: 'CarrefourSA',       logo: 'images/carrefour.png',         url: 'https://www.carrefoursa.com/search/?text=' },
    mopas:             { name: 'Mopaş',             logo: 'images/mopas.png',             url: 'https://mopas.com.tr/search/?text=' },
    aftaMarket:        { name: 'Afta Market',       logo: 'images/afta.png',              url: 'https://www.aftamarket.com.tr/arama?q=' },
    sokMarket:         { name: 'Şok Market',        logo: 'images/sok.png',               url: 'https://www.sokmarket.com.tr/arama?q=' },
    marketKarsilastir: { name: 'Mkt. Karşılaştır', logo: 'images/market-karsilastir.svg', url: 'https://marketkarsilastir.com/ara?q=' },
};

function cellId(barcode, platform) { return `price-cell-${barcode}-${platform}`; }

function loadingCell(barcode, market) {
    const cfg = marketConfig[market];
    return `
        <div class="price-cell price-cell--loading" id="${cellId(barcode, market)}">
            <div class="price-cell-market">
                <img src="${cfg.logo}" alt="${cfg.name}" class="price-cell-logo">
                <span class="price-cell-market-name">${cfg.name}</span>
            </div>
            <div class="price-cell-loader skeleton-line skeleton-line--short"></div>
        </div>`;
}

function ensurePriceCard(barcode, container) {
    if (document.getElementById(`price-card-${barcode}`)) return;
    const cells = PRICE_PLATFORMS.map(m => loadingCell(barcode, m)).join('');
    container.insertAdjacentHTML('beforeend', `
        <div class="result-card result-card--searching" id="price-card-${barcode}" data-barcode="${barcode}">
            <div class="result-card-header">
                <div class="result-card-left">
                    <div class="result-status-icon result-status-icon--searching">
                        <span class="material-symbols-outlined">bolt</span>
                    </div>
                    <span class="result-barcode-number">${barcode}</span>
                    <span class="result-badge badge-searching">0 ${t('badge.found')} · ${PRICE_PLATFORMS.length} ${t('badge.loading')}</span>
                </div>
            </div>
            <div class="result-prices-grid">${cells}</div>
        </div>`);
}

function refreshBestPrices(barcode, prices) {
    const entries = PRICE_PLATFORMS.filter(p => prices[p]).map(p => ({ platform: p, value: parseFloat(prices[p]) }));
    if (entries.length === 0) return;
    const best = Math.min(...entries.map(e => e.value));
    PRICE_PLATFORMS.forEach(p => {
        const el = document.getElementById(cellId(barcode, p));
        if (!el || !prices[p]) return;
        const isBest = parseFloat(prices[p]) === best;
        el.classList.toggle('price-cell--best', isBest);
        const lbl = el.querySelector('.price-cell-best-label');
        if (lbl) lbl.remove();
        if (isBest) {
            const div = document.createElement('div');
            div.className = 'price-cell-best-label';
            div.textContent = t('cell.best');
            el.appendChild(div);
        }
    });
}

function patchPlatformCell(barcode, platform, price) {
    const cfg = marketConfig[platform];
    if (!cfg) return;
    const el = document.getElementById(cellId(barcode, platform));
    if (!el) return;
    const productUrl = cfg.url + encodeURIComponent(barcode);
    if (price != null) {
        el.outerHTML = `
            <a href="${productUrl}" target="_blank" rel="noopener" class="price-cell" id="${cellId(barcode, platform)}">
                <svg class="price-cell-open-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z"/></svg>
                <div class="price-cell-market">
                    <img src="${cfg.logo}" alt="${cfg.name}" class="price-cell-logo">
                    <span class="price-cell-market-name">${cfg.name}</span>
                </div>
                <div class="price-cell-value">${price} ₺</div>
            </a>`;
    } else {
        el.outerHTML = `
            <div class="price-cell price-cell--not-found" id="${cellId(barcode, platform)}">
                <div class="price-cell-market">
                    <img src="${cfg.logo}" alt="${cfg.name}" class="price-cell-logo">
                    <span class="price-cell-market-name">${cfg.name}</span>
                </div>
                <div class="price-cell-not-found">${t('cell.notFound')}</div>
            </div>`;
    }
}

function finalizePriceCard(barcode, state) {
    const card = document.getElementById(`price-card-${barcode}`);
    if (!card) return;
    const found = PRICE_PLATFORMS.filter(p => state.prices[p] != null).length;
    card.classList.remove('result-card--searching');
    let variant, iconVar, badgeClass, statusText, iconName;
    if (found === PRICE_PLATFORMS.length) {
        variant = 'result-card--success'; iconVar = 'result-status-icon--success'; badgeClass = 'badge-success';
        statusText = t('status.allFound'); iconName = 'check_circle';
    } else if (found > 0) {
        variant = 'result-card--partial'; iconVar = 'result-status-icon--partial'; badgeClass = 'badge-partial';
        statusText = t('badge.partial', found, PRICE_PLATFORMS.length); iconName = 'adjust';
    } else {
        variant = 'result-card--not-found'; iconVar = 'result-status-icon--not-found'; badgeClass = 'badge-not-found';
        statusText = t('status.noneFound'); iconName = 'cancel';
    }
    card.classList.add(variant);
    const iconWrap = card.querySelector('.result-status-icon');
    if (iconWrap) { iconWrap.className = 'result-status-icon ' + iconVar; iconWrap.innerHTML = `<span class="material-symbols-outlined">${iconName}</span>`; }
    const badge = card.querySelector('.result-badge');
    if (badge) { badge.className = 'result-badge ' + badgeClass; badge.textContent = statusText; }
    refreshBestPrices(barcode, state.prices);
}

async function searchPrices() {
    const input = document.getElementById('pricesBarcodeInput').value;
    const barcodes = parseBarcodes(input);
    if (barcodes.length === 0) { alert(t('alert.noBarcodes')); return; }

    const loadingDiv    = document.getElementById('pricesLoading');
    const resultsDiv    = document.getElementById('pricesLiveResults');
    const searchBtn     = document.getElementById('pricesSearchBtn');
    const clearBtn      = document.querySelector('#panel-prices .btn-secondary');
    const progressFill  = document.getElementById('pricesProgressFill');
    const progressText  = document.getElementById('pricesProgressText');

    setSearching(true);
    loadingDiv.classList.add('active');
    progressFill.style.width = '0%';
    progressText.textContent = t('search.starting', barcodes.length, PRICE_PLATFORMS.length);
    resultsDiv.innerHTML = '';
    searchBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;

    document.getElementById('pricesResultsSection').style.display = 'block';
    document.getElementById('pricesEmptyState').style.display = 'none';

    const statusChip  = document.getElementById('statusChip');
    const statusLabel = document.getElementById('statusLabel');
    statusChip.className = 'status-chip searching';
    statusLabel.textContent = t('status.searching');

    const barcodeState = {};
    window.pricesExportData = [];
    barcodes.forEach(b => { barcodeState[b] = { responded: 0, prices: {} }; });
    barcodes.forEach(b => ensurePriceCard(b, resultsDiv));

    let completedBarcodes = 0;

    try {
        const response = await fetch('/api/prices/search-stream-fast', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ barcodes })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                let data;
                try { data = JSON.parse(line.slice(6)); } catch { continue; }

                if (data.type === 'result') {
                    const { barcode, platform, price } = data;
                    const st = barcodeState[barcode];
                    if (!st) continue;
                    st.responded++;
                    st.prices[platform] = price != null ? (typeof price === 'number' ? price.toFixed(2) : String(price)) : null;
                    patchPlatformCell(barcode, platform, price);
                    refreshBestPrices(barcode, st.prices);
                    const hdrBadge = document.querySelector(`#price-card-${barcode} .result-badge`);
                    if (hdrBadge && st.responded < PRICE_PLATFORMS.length) {
                        const foundCount = PRICE_PLATFORMS.filter(p => st.prices[p]).length;
                        hdrBadge.textContent = t('badge.searching', foundCount, PRICE_PLATFORMS.length - st.responded);
                    }
                    if (st.responded === PRICE_PLATFORMS.length) {
                        completedBarcodes++;
                        progressFill.style.width = Math.round((completedBarcodes / barcodes.length) * 100) + '%';
                        progressText.textContent = t('search.progress', completedBarcodes, barcodes.length);
                        finalizePriceCard(barcode, st);
                        window.pricesExportData.push({ barcode, prices: { ...st.prices } });
                        document.getElementById('pricesResultsCount').textContent = t('count.progress', completedBarcodes, barcodes.length);
                    }
                }
                if (data.type === 'complete') {
                    loadingDiv.classList.remove('active');
                    displayPricesSummary(window.pricesExportData, resultsDiv);
                    statusChip.className = 'status-chip done';
                    statusLabel.textContent = t('status.done');
                }
                if (data.type === 'error') throw new Error(data.message || 'Bilinmeyen hata');
            }
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error"><strong>${t('status.error')}:</strong> ${error.message}<br><br>${t('err.server')}</div>`;
        loadingDiv.classList.remove('active');
        statusChip.className = 'status-chip'; statusLabel.textContent = t('status.error');
    } finally {
        searchBtn.disabled = false;
        if (clearBtn) clearBtn.disabled = false;
        setSearching(false);
    }
}

function displayPricesSummary(results, container) {
    if (document.querySelector('#panel-prices .summary-section')) return;
    const rows = results.map(result => {
        const prices = PRICE_PLATFORMS.filter(p => result.prices[p]).map(p => ({ market: p, value: parseFloat(result.prices[p]) }));
        const lowest   = prices.length ? Math.min(...prices.map(p => p.value)) : null;
        const highest  = prices.length ? Math.max(...prices.map(p => p.value)) : null;
        const bestEntry = prices.find(p => p.value === lowest);
        const found = prices.length;
        let statusClass, statusText;
        if (found === PRICE_PLATFORMS.length) { statusClass = 'status-success'; statusText = t('status.allFound'); }
        else if (found > 0) { statusClass = 'status-partial'; statusText = t('badge.partial', found, PRICE_PLATFORMS.length); }
        else { statusClass = 'status-not-found'; statusText = t('badge.notFound'); }
        const bestMarket = bestEntry ? marketConfig[bestEntry.market] : null;
        return `<tr>
            <td class="summary-barcode">${result.barcode}</td>
            <td class="summary-lowest">${lowest !== null ? '₺' + lowest.toFixed(2) : '—'}</td>
            <td class="summary-highest">${highest !== null ? '₺' + highest.toFixed(2) : '—'}</td>
            <td>${bestMarket ? `<div class="summary-market-cell">${bestMarket.logo ? `<img src="${bestMarket.logo}" class="summary-market-logo" alt="">` : ''}<span class="summary-market-name">${bestMarket.name}</span></div>` : '—'}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        </tr>`;
    }).join('');

    container.insertAdjacentHTML('beforeend', `
        <div class="summary-section">
            <div class="summary-section-header">
                <h3 class="summary-section-title">${t('summary.title')}</h3>
                <button class="btn-export" onclick="exportPricesToCsv()">
                    <span class="material-symbols-outlined">download</span>${t('summary.btn')}
                </button>
            </div>
            <div class="summary-table-wrapper">
                <table class="summary-table">
                    <thead><tr>
                        <th>${t('col.barcode')}</th>
                        <th>${t('col.lowest')}</th>
                        <th>${t('col.highest')}</th>
                        <th>${t('col.bestMarket')}</th>
                        <th>${t('col.status')}</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>`);
}

function exportPricesToCsv() {
    const data = window.pricesExportData || [];
    if (!data.length) { alert(t('alert.noData')); return; }
    const header = `${t('col.barcode')},${PRICE_PLATFORMS.map(k => marketConfig[k].name).join(',')}`;
    let csv = header + '\n';
    data.forEach(row => {
        const cells = PRICE_PLATFORMS.map(p => row.prices[p] || '');
        csv += [row.barcode, ...cells.map(c => c === '' ? t('cell.notFound') : c)].join(',') + '\n';
    });
    downloadCsv(csv, `${t('csv.prices.prefix')}_${today()}.csv`);
}

function clearPrices() {
    if (isSearching) return;
    document.getElementById('pricesBarcodeInput').value = '';
    document.getElementById('pricesLiveResults').innerHTML = '';
    document.getElementById('pricesLoading').classList.remove('active');
    document.getElementById('pricesResultsSection').style.display = 'none';
    document.getElementById('pricesEmptyState').style.display = 'flex';
    window.pricesExportData = [];
    resetStatus();
}

/* ========== PRODUCTS MODE ========== */

function ensureProductCard(barcode, container) {
    if (document.getElementById(`product-card-${barcode}`)) return;
    container.insertAdjacentHTML('beforeend', `
        <div class="result-card result-card--searching" id="product-card-${barcode}">
            <div class="result-card-header">
                <div class="result-card-left">
                    <div class="result-status-icon result-status-icon--searching">
                        <span class="material-symbols-outlined">bolt</span>
                    </div>
                    <span class="result-barcode-number">${barcode}</span>
                    <span class="result-badge badge-searching">${t('badge.loading')}</span>
                </div>
            </div>
        </div>`);
}

function resolveProductCard(result) {
    const card = document.getElementById(`product-card-${result.barcode}`);
    if (!card) return;
    card.classList.remove('result-card--searching');

    if (result.success) {
        const product = result.product || {};
        const market  = marketConfig[result.site] || { name: result.site, logo: null };
        const imgHtml = product.productImgSrc
            ? `<img class="product-img" src="${product.productImgSrc}" alt="" onerror="this.style.display='none'">`
            : `<div class="product-img-placeholder"><span class="material-symbols-outlined">image_not_supported</span></div>`;
        const logoHtml = market.logo ? `<img src="${market.logo}" class="market-logo" alt="${market.name}">` : '';
        const categoryHtml = Array.isArray(product.categoryPath) && product.categoryPath.length
            ? `<div class="product-category">${product.categoryPath.map(c => `<span class="category-crumb">${c}</span>`).join('')}</div>`
            : '';

        card.classList.add('result-card--success');
        card.innerHTML = `
            <div class="result-card-header">
                <div class="result-card-left">
                    <div class="result-status-icon result-status-icon--success">
                        <span class="material-symbols-outlined">check_circle</span>
                    </div>
                    <span class="result-barcode-number">${result.barcode}</span>
                    <span class="result-badge badge-success">${t('badge.found')}</span>
                </div>
            </div>
            <div class="product-detail">
                ${imgHtml}
                <div class="product-info">
                    <div class="product-market">${logoHtml}<span class="market-name">${market.name}</span></div>
                    <div class="product-title">${product.productTitle || '—'}</div>
                    <div class="product-price">${product.productPrice ? '₺' + product.productPrice : '—'}</div>
                    ${categoryHtml}
                </div>
            </div>`;
    } else {
        card.classList.add('result-card--not-found');
        card.innerHTML = `
            <div class="result-card-header">
                <div class="result-card-left">
                    <div class="result-status-icon result-status-icon--not-found">
                        <span class="material-symbols-outlined">cancel</span>
                    </div>
                    <span class="result-barcode-number">${result.barcode}</span>
                    <span class="result-badge badge-not-found">${t('badge.notFound')}</span>
                </div>
            </div>`;
    }
}

async function searchProducts() {
    const input = document.getElementById('productsBarcodeInput').value;
    const barcodes = parseBarcodes(input);
    if (barcodes.length === 0) { alert(t('alert.noBarcodes')); return; }

    const loadingDiv    = document.getElementById('productsLoading');
    const resultsDiv    = document.getElementById('productsLiveResults');
    const searchBtn     = document.getElementById('productsSearchBtn');
    const clearBtn      = document.querySelector('#panel-products .btn-secondary');
    const progressFill  = document.getElementById('productsProgressFill');
    const progressText  = document.getElementById('productsProgressText');

    setSearching(true);
    loadingDiv.classList.add('active');
    progressFill.style.width = '0%';
    progressText.textContent = t('prod.searching', barcodes.length);
    resultsDiv.innerHTML = '';
    searchBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;

    document.getElementById('productsResultsSection').style.display = 'block';
    document.getElementById('productsEmptyState').style.display = 'none';

    const statusChip  = document.getElementById('statusChip');
    const statusLabel = document.getElementById('statusLabel');
    statusChip.className = 'status-chip searching';
    statusLabel.textContent = t('status.searching');

    window.productsExportData = [];
    barcodes.forEach(b => ensureProductCard(b, resultsDiv));

    let completed = 0;

    try {
        const response = await fetch('/api/products/search', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ barcodes })
        });

        const reader  = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                let data;
                try { data = JSON.parse(line.slice(6)); } catch { continue; }

                if (data.type === 'result') {
                    resolveProductCard(data);
                    window.productsExportData.push(data);
                    completed++;
                    progressFill.style.width = Math.round((completed / barcodes.length) * 100) + '%';
                    progressText.textContent  = t('search.progress', completed, barcodes.length);
                    document.getElementById('productsResultsCount').textContent = t('count.progress', completed, barcodes.length);
                }
                if (data.type === 'complete') {
                    loadingDiv.classList.remove('active');
                    displayProductsSummary(window.productsExportData, resultsDiv);
                    statusChip.className  = 'status-chip done';
                    statusLabel.textContent = t('status.done');
                }
                if (data.type === 'error') throw new Error(data.message || 'Bilinmeyen hata');
            }
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error"><strong>${t('status.error')}:</strong> ${error.message}<br><br>${t('err.server')}</div>`;
        loadingDiv.classList.remove('active');
        statusChip.className = 'status-chip'; statusLabel.textContent = t('status.error');
    } finally {
        searchBtn.disabled = false;
        if (clearBtn) clearBtn.disabled = false;
        setSearching(false);
    }
}

function displayProductsSummary(results, container) {
    if (document.querySelector('#panel-products .summary-section')) return;
    const found    = results.filter(r => r.success).length;
    const notFound = results.filter(r => !r.success).length;

    const rows = results.map(r => {
        if (r.success) {
            const p = r.product || {};
            const market = marketConfig[r.site] || { name: r.site, logo: null };
            const logoHtml = market.logo ? `<img src="${market.logo}" class="summary-market-logo" alt="">` : '';
            return `<tr>
                <td class="summary-barcode">${r.barcode}</td>
                <td><div class="summary-market-cell">${logoHtml}<span class="summary-market-name">${market.name}</span></div></td>
                <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.productTitle || '—'}</td>
                <td class="summary-lowest">${p.productPrice ? '₺' + p.productPrice : '—'}</td>
                <td><span class="status-badge status-success">${t('badge.found')}</span></td>
            </tr>`;
        }
        return `<tr><td class="summary-barcode">${r.barcode}</td><td colspan="3">—</td><td><span class="status-badge status-not-found">${t('badge.notFound')}</span></td></tr>`;
    }).join('');

    container.insertAdjacentHTML('beforeend', `
        <div class="summary-section">
            <div class="summary-section-header">
                <h3 class="summary-section-title">${t('summary.products', found, notFound)}</h3>
                <button class="btn-export" onclick="exportProductsToCsv()">
                    <span class="material-symbols-outlined">download</span>${t('summary.btn')}
                </button>
            </div>
            <div class="summary-table-wrapper">
                <table class="summary-table">
                    <thead><tr>
                        <th>${t('col.barcode')}</th>
                        <th>${t('col.platform')}</th>
                        <th>${t('col.productName')}</th>
                        <th>${t('col.price')}</th>
                        <th>${t('col.status')}</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>`);
}

function exportProductsToCsv() {
    const data = window.productsExportData || [];
    if (!data.length) { alert(t('alert.noDataProd')); return; }
    const esc = v => { const s = String(v ?? ''); return (s.includes(',') || s.includes('"')) ? `"${s.replace(/"/g, '""')}"` : s; };
    let csv = `${t('col.barcode')},${t('col.platform')},${t('col.productName')},${t('col.price')},${t('col.status')}\n`;
    data.forEach(r => {
        if (r.success) {
            const p = r.product || {};
            const market = marketConfig[r.site]?.name || r.site;
            const category = Array.isArray(p.categoryPath) ? p.categoryPath.join(' > ') : '';
            csv += [r.barcode, market, p.productTitle || '', p.productPrice || '', category].map(esc).join(',') + '\n';
        } else {
            csv += [r.barcode, t('badge.notFound'), '', '', ''].map(esc).join(',') + '\n';
        }
    });
    downloadCsv(csv, `${t('csv.products.prefix')}_${today()}.csv`);
}

function clearProducts() {
    if (isSearching) return;
    document.getElementById('productsBarcodeInput').value = '';
    document.getElementById('productsLiveResults').innerHTML = '';
    document.getElementById('productsLoading').classList.remove('active');
    document.getElementById('productsResultsSection').style.display = 'none';
    document.getElementById('productsEmptyState').style.display = 'flex';
    window.productsExportData = [];
    resetStatus();
}

/* ========== UTILS ========== */

function today() { return new Date().toISOString().split('T')[0]; }

function downloadCsv(csv, filename) {
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ========== KEYBOARD SHORTCUTS ========== */

document.addEventListener('keypress', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        if (currentMode === 'prices') searchPrices();
        else searchProducts();
    }
});

/* ========== INIT ========== */

applyI18n();

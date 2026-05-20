/* ========== MODE SWITCHER ========== */

let currentMode = 'prices';
let isSearching = false;

function setSearching(active) {
    isSearching = active;
    const tabPrices   = document.getElementById('tab-prices');
    const tabProducts = document.getElementById('tab-products');
    tabPrices.disabled   = active;
    tabProducts.disabled = active;
    document.querySelector('.mode-tabs').classList.toggle('tabs-locked', active);
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
    document.getElementById('statusLabel').textContent = 'Bekleniyor';
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
                    <span class="result-badge badge-searching">0 bulundu · ${PRICE_PLATFORMS.length} aranıyor...</span>
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
            div.textContent = 'En Ucuz';
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
                <div class="price-cell-not-found">Bulunamadı</div>
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
        variant = 'result-card--success'; iconVar = 'result-status-icon--success'; badgeClass = 'badge-success'; statusText = 'Tümünde Bulundu'; iconName = 'check_circle';
    } else if (found > 0) {
        variant = 'result-card--partial'; iconVar = 'result-status-icon--partial'; badgeClass = 'badge-partial'; statusText = `${found}/${PRICE_PLATFORMS.length} Markette`; iconName = 'adjust';
    } else {
        variant = 'result-card--not-found'; iconVar = 'result-status-icon--not-found'; badgeClass = 'badge-not-found'; statusText = 'Hiçbir Yerde Bulunamadı'; iconName = 'cancel';
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
    if (barcodes.length === 0) { alert('Lütfen en az bir barkod girin!'); return; }

    const loadingDiv    = document.getElementById('pricesLoading');
    const resultsDiv    = document.getElementById('pricesLiveResults');
    const searchBtn     = document.getElementById('pricesSearchBtn');
    const clearBtn      = document.querySelector('#panel-prices .btn-secondary');
    const progressFill  = document.getElementById('pricesProgressFill');
    const progressText  = document.getElementById('pricesProgressText');

    setSearching(true);
    loadingDiv.classList.add('active');
    progressFill.style.width = '0%';
    progressText.textContent = `${barcodes.length} barkod, ${PRICE_PLATFORMS.length} platformda aranıyor...`;
    resultsDiv.innerHTML = '';
    searchBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;

    document.getElementById('pricesResultsSection').style.display = 'block';
    document.getElementById('pricesEmptyState').style.display = 'none';

    const statusChip  = document.getElementById('statusChip');
    const statusLabel = document.getElementById('statusLabel');
    statusChip.className = 'status-chip searching';
    statusLabel.textContent = 'Aranıyor...';

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
                        const found = PRICE_PLATFORMS.filter(p => st.prices[p]).length;
                        hdrBadge.textContent = `${found} bulundu · ${PRICE_PLATFORMS.length - st.responded} bekleniyor...`;
                    }
                    if (st.responded === PRICE_PLATFORMS.length) {
                        completedBarcodes++;
                        progressFill.style.width = Math.round((completedBarcodes / barcodes.length) * 100) + '%';
                        progressText.textContent = `${completedBarcodes}/${barcodes.length} barkod tamamlandı`;
                        finalizePriceCard(barcode, st);
                        window.pricesExportData.push({ barcode, prices: { ...st.prices } });
                        document.getElementById('pricesResultsCount').textContent = `${completedBarcodes} / ${barcodes.length} barkod tamamlandı`;
                    }
                }
                if (data.type === 'complete') {
                    loadingDiv.classList.remove('active');
                    displayPricesSummary(window.pricesExportData, resultsDiv);
                    statusChip.className = 'status-chip done';
                    statusLabel.textContent = 'Tamamlandı';
                }
                if (data.type === 'error') throw new Error(data.message || 'Bilinmeyen hata');
            }
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error"><strong>Hata:</strong> ${error.message}<br><br>Sunucunun çalıştığından emin olun: <code>node server.js</code></div>`;
        loadingDiv.classList.remove('active');
        statusChip.className = 'status-chip'; statusLabel.textContent = 'Hata';
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
        const lowest  = prices.length ? Math.min(...prices.map(p => p.value)) : null;
        const highest = prices.length ? Math.max(...prices.map(p => p.value)) : null;
        const bestEntry = prices.find(p => p.value === lowest);
        const found = prices.length;
        let statusClass, statusText;
        if (found === PRICE_PLATFORMS.length) { statusClass = 'status-success'; statusText = 'Tümünde Bulundu'; }
        else if (found > 0) { statusClass = 'status-partial'; statusText = `${found}/${PRICE_PLATFORMS.length} Markette`; }
        else { statusClass = 'status-not-found'; statusText = 'Bulunamadı'; }
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
                <h3 class="summary-section-title">Özet Tablo</h3>
                <button class="btn-export" onclick="exportPricesToCsv()">
                    <span class="material-symbols-outlined">download</span>CSV İndir
                </button>
            </div>
            <div class="summary-table-wrapper">
                <table class="summary-table">
                    <thead><tr><th>Barkod</th><th>En Düşük</th><th>En Yüksek</th><th>En İyi Market</th><th>Durum</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>`);
}

function exportPricesToCsv() {
    const data = window.pricesExportData || [];
    if (!data.length) { alert('Henüz dışa aktarılacak veri yok!'); return; }
    const header = `Barkod,${PRICE_PLATFORMS.map(k => marketConfig[k].name).join(',')}`;
    let csv = header + '\n';
    data.forEach(row => {
        const cells = PRICE_PLATFORMS.map(p => row.prices[p] || '');
        csv += [row.barcode, ...cells.map(c => c === '' ? 'Bulunamadı' : c)].join(',') + '\n';
    });
    downloadCsv(csv, `fiyat_karsilastirma_${today()}.csv`);
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
                    <span class="result-badge badge-searching">Aranıyor...</span>
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
                    <span class="result-badge badge-success">Bulundu</span>
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
                    <span class="result-badge badge-not-found">Bulunamadı</span>
                </div>
            </div>`;
    }
}

async function searchProducts() {
    const input = document.getElementById('productsBarcodeInput').value;
    const barcodes = parseBarcodes(input);
    if (barcodes.length === 0) { alert('Lütfen en az bir barkod girin!'); return; }

    const loadingDiv    = document.getElementById('productsLoading');
    const resultsDiv    = document.getElementById('productsLiveResults');
    const searchBtn     = document.getElementById('productsSearchBtn');
    const clearBtn      = document.querySelector('#panel-products .btn-secondary');
    const progressFill  = document.getElementById('productsProgressFill');
    const progressText  = document.getElementById('productsProgressText');

    setSearching(true);
    loadingDiv.classList.add('active');
    progressFill.style.width = '0%';
    progressText.textContent = `${barcodes.length} barkod aranıyor...`;
    resultsDiv.innerHTML = '';
    searchBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;

    document.getElementById('productsResultsSection').style.display = 'block';
    document.getElementById('productsEmptyState').style.display = 'none';

    const statusChip  = document.getElementById('statusChip');
    const statusLabel = document.getElementById('statusLabel');
    statusChip.className = 'status-chip searching';
    statusLabel.textContent = 'Aranıyor...';

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
                    progressText.textContent  = `${completed}/${barcodes.length} barkod tamamlandı`;
                    document.getElementById('productsResultsCount').textContent = `${completed} / ${barcodes.length} barkod tamamlandı`;
                }
                if (data.type === 'complete') {
                    loadingDiv.classList.remove('active');
                    displayProductsSummary(window.productsExportData, resultsDiv);
                    statusChip.className  = 'status-chip done';
                    statusLabel.textContent = 'Tamamlandı';
                }
                if (data.type === 'error') throw new Error(data.message || 'Bilinmeyen hata');
            }
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error"><strong>Hata:</strong> ${error.message}<br><br>Sunucunun çalıştığından emin olun: <code>node server.js</code></div>`;
        loadingDiv.classList.remove('active');
        statusChip.className = 'status-chip'; statusLabel.textContent = 'Hata';
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
                <td><span class="status-badge status-success">Bulundu</span></td>
            </tr>`;
        }
        return `<tr><td class="summary-barcode">${r.barcode}</td><td colspan="3">—</td><td><span class="status-badge status-not-found">Bulunamadı</span></td></tr>`;
    }).join('');

    container.insertAdjacentHTML('beforeend', `
        <div class="summary-section">
            <div class="summary-section-header">
                <h3 class="summary-section-title">Özet — ${found} bulundu, ${notFound} bulunamadı</h3>
                <button class="btn-export" onclick="exportProductsToCsv()">
                    <span class="material-symbols-outlined">download</span>CSV İndir
                </button>
            </div>
            <div class="summary-table-wrapper">
                <table class="summary-table">
                    <thead><tr><th>Barkod</th><th>Platform</th><th>Ürün Adı</th><th>Fiyat</th><th>Durum</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>`);
}

function exportProductsToCsv() {
    const data = window.productsExportData || [];
    if (!data.length) { alert('Henüz veri yok!'); return; }
    const esc = v => { const s = String(v ?? ''); return (s.includes(',') || s.includes('"')) ? `"${s.replace(/"/g, '""')}"` : s; };
    let csv = 'Barkod,Platform,Ürün Adı,Fiyat,Kategori\n';
    data.forEach(r => {
        if (r.success) {
            const p = r.product || {};
            const market = marketConfig[r.site]?.name || r.site;
            const category = Array.isArray(p.categoryPath) ? p.categoryPath.join(' > ') : '';
            csv += [r.barcode, market, p.productTitle || '', p.productPrice || '', category].map(esc).join(',') + '\n';
        } else {
            csv += [r.barcode, 'Bulunamadı', '', '', ''].map(esc).join(',') + '\n';
        }
    });
    downloadCsv(csv, `urun_sonuclar_${today()}.csv`);
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

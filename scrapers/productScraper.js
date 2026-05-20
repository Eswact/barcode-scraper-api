const cheerio = require("cheerio");
const fs = require("fs");
const { MARKETS } = require("../config/markets");
const { USER_AGENT, launchBrowser } = require("./browser");
const { normalizePrice } = require("../utils/price");
const { outputPath, ensureDirForFile } = require("../scripts/datasFs");

const productListPath = outputPath("product-list.json");
const notFoundPath    = outputPath("not-found-barcodes.json");

function resolveUrl(marketName, href) {
    if (!href) return null;
    if (href.startsWith("http")) return href;
    return (MARKETS[marketName]?.baseUrl || "") + href;
}

const parsers = {
    trendyol: ($) => {
        if ($(".did-you-mean .information-banner .information-text").text().includes("bulunamadı")) return false;
        if ($(".search-result-content .product-card").get().length === 0) return false;
        return $(".search-result-content .product-card").get().map((el) => ({
            productImgSrc: $(el).find(".image-wrapper:first-child .image-slider:first-child img:first-child").attr("src") || "",
            productTitle:  $(el).find(".brand-name-wrapper .product-brand").text().trim() + " " + $(el).find(".brand-name-wrapper .product-name").text().trim(),
            productPrice:  $(el).find(".single-price .price-section").text().trim() || "",
            productUrl:    $(el).attr("href") || $(el).find("a").first().attr("href") || "",
        }));
    },
    hepsiburada: ($) => {
        const firstItem = $("li#i0");
        if (firstItem.length === 0) return false;
        return [{
            productImgSrc: firstItem.find("picture img").attr("src") || "",
            productTitle:  firstItem.find('[data-test-id^="title-"] a').text().trim() || "",
            productPrice:  firstItem.find('[data-test-id^="final-price-"]').text().trim() || "",
            productUrl:    firstItem.find("a").attr("href") || "",
        }];
    },
    pazarama: ($) => {
        if ($(".product-card").get().length > 1) return false;
        return $(".product-card").get().map((el) => ({
            productImgSrc: $(el).find("picture img:first-child").attr("src") || "",
            productTitle:  $(el).find("[data-testid='product-card-title']").text().trim() || "",
            productPrice:  $(el).find(".product-card__price .leading-tight").last().text().trim() || "",
            productUrl:    $(el).find("a").first().attr("href") || "",
        }));
    },
    mopas: ($) => {
        if ($(".product-list-grid .card").get().length > 1) return false;
        return $(".product-list-grid .card").get().map((el) => ({
            productImgSrc: $(el).find("img").attr("src") || "",
            productTitle:  $(el).find(".product-title").text().trim() || "",
            productPrice:  $(el).find(".sale-price").text().trim() || "",
            productUrl:    $(el).find("a").first().attr("href") || "",
        }));
    },
    aftaMarket: ($) => {
        if ($(".catalogWrapper .productItem").get().length > 1) return false;
        return $(".catalogWrapper .productItem").get().map((el) => ({
            productImgSrc: $(el).find(".stImage").data("src") || "",
            productTitle:  $(el).find(".vitrin-urun-adi").text().trim() || "",
            productPrice:  $(el).find(".productPrice .currentPrice").text().trim() || "",
            productUrl:    $(el).find("a.detailLink").first().attr("href") || "",
        }));
    },
    carrefour: ($) => {
        if ($(".product-listing .product-listing-item .hover-box").get().length > 1) return false;
        return $(".product-listing .product-listing-item .hover-box").get().map((el) => ({
            productImgSrc: $(el).find("img").attr("src") || "",
            productTitle:  $(el).find(".item-name").text().trim() || "",
            productPrice:  $(el).find(".item-price").attr("content") || "",
            productUrl:    $(el).find("a.product-return").first().attr("href") || "",
        }));
    },
    sokMarket: ($) => {
        if ($('p:contains("İlgili Sonuç Bulunamadı")').length > 0) return false;
        if ($('p:contains("0 adet ürün listelendi")').length > 0) return false;
        const productCards = $(".CProductCard-module_productCardWrapper__okAmT, [class*='productCardWrapper']");
        if (productCards.length === 0) return false;
        return productCards.get().map((el) => ({
            productPrice:  $(el).find("[class*='CPriceBox-module_price'], .CPriceBox-module_price__bYk-c").first().text().trim() || "",
            productTitle:  $(el).find("[class*='CProductCard-module_title'], .CProductCard-module_title__u8bMW").first().text().trim() || "",
            productImgSrc: $(el).find("[class*='CProductCard-module_title'] img, .CProductCard-module_imageContainer__aTMdz img").attr("src") || "",
            productUrl:    $(el).closest("a").attr("href") || $(el).find("a").first().attr("href") || "",
        }));
    },
    marketKarsilastir: ($) => {
        const cards = $(".product-card").get();
        if (cards.length === 0) return false;
        return cards.slice(0, 1).map((el) => ({
            productImgSrc: $(el).find(".product-image").attr("src") || "",
            productTitle:  $(el).find(".product-name").text().trim() || "",
            productPrice:  $(el).find(".product-price-badge").clone().children("small").remove().end().text().trim() || "",
            categoryPath:  (() => { const c = $(el).find(".product-category").text().trim(); return c ? [c] : []; })(),
        }));
    },
};

const breadcrumbWaitSelectors = {
    trendyol:    "#breadcrumb-context ul.breadcrumb",
    hepsiburada: '[data-test-id="breadcrumb-last-item"]',
    pazarama:    '[data-testid="base-breadcrumb-link"]',
    mopas:       ".container-fluid.breadcrumb",
    aftaMarket:  "#navigasyon ul.breadcrumb",
    carrefour:   'script[type="application/ld+json"]',
    sokMarket:   '[class*="Breadcrumb_breadcrumbs"]',
};

const breadcrumbParsers = {
    trendyol: ($) => {
        let jsonItems = null;
        $("script").each((_, el) => {
            if (jsonItems) return;
            const html = $(el).html() || "";
            if (!html.includes("__product-detail-seo__PROPS")) return;
            try {
                const data = JSON.parse(html.replace(/^window\[["']__product-detail-seo__PROPS["']\]=/, ""));
                if (Array.isArray(data.breadcrumbs) && data.breadcrumbs.length) {
                    jsonItems = data.breadcrumbs.filter(b => b.name && b.name.trim() !== "Trendyol").map(b => b.name.trim());
                }
            } catch {}
        });
        if (jsonItems && jsonItems.length) return jsonItems;
        const items = [];
        $("#breadcrumb-context ul.breadcrumb li a, #product-detail-breadcrumbs ul.breadcrumb-list li a").each((_, el) => {
            const text = $(el).text().trim();
            if (text && text !== "Trendyol") items.push(text);
        });
        return items;
    },
    hepsiburada: ($) => {
        const lastItem = $('[data-test-id="breadcrumb-last-item"]');
        if (!lastItem.length) return [];
        const items = [];
        lastItem.closest("ul").find("li a").each((_, el) => {
            const text = $(el).text().trim();
            if (text && text !== "Anasayfa") items.push(text);
        });
        return items;
    },
    pazarama: ($) => {
        const items = [];
        $('[data-testid="base-breadcrumb-link"]').each((_, el) => {
            const text = $(el).text().trim();
            if (text && text !== "Anasayfa") items.push(text);
        });
        return items;
    },
    mopas: ($) => {
        const items = [];
        $(".container-fluid.breadcrumb ol li a span").each((_, el) => {
            const text = $(el).text().trim();
            if (text && text !== "Mopaş Kategoriler") items.push(text);
        });
        return items;
    },
    aftaMarket: ($) => {
        const items = [];
        $("#navigasyon ul.breadcrumb li a").each((_, el) => {
            const title = $(el).attr("title");
            if (title && title !== "Anasayfa") items.push(title);
        });
        return items;
    },
    carrefour: ($) => {
        try {
            const scriptEl = $('script[type="application/ld+json"]').filter((_, el) => $(el).html().includes('"BreadcrumbList"'));
            if (!scriptEl.length) return [];
            const data = JSON.parse(scriptEl.first().html());
            return (data.itemListElement || []).slice(1, -1).map(item => item.name);
        } catch { return []; }
    },
    sokMarket: ($) => {
        const items = [];
        $('[class*="Breadcrumb_breadcrumbs"] a').each((_, el) => {
            const text = $(el).text().trim();
            if (text && text !== "Market") items.push(text);
        });
        return items;
    },
};

function loadProductList() {
    if (!fs.existsSync(productListPath)) return [];
    try { return JSON.parse(fs.readFileSync(productListPath)); } catch { return []; }
}

function loadNotFoundBarcodes() {
    if (!fs.existsSync(notFoundPath)) return [];
    try { return JSON.parse(fs.readFileSync(notFoundPath, "utf-8")); } catch { return []; }
}

function addProductList(product) {
    const existing = loadProductList();
    if (existing.find(item => item.barcode === product.barcode)) return;
    existing.push(product);
    try { ensureDirForFile(productListPath); fs.writeFileSync(productListPath, JSON.stringify(existing, null, 2)); }
    catch (err) { console.warn("product-list.json yazılamadı:", err.message); }
}

function addNotFoundBarcode(barcode) {
    let list = [];
    if (fs.existsSync(notFoundPath)) {
        try { list = JSON.parse(fs.readFileSync(notFoundPath, "utf-8")); } catch { list = []; }
    }
    if (!list.includes(barcode)) {
        list.push(barcode);
        ensureDirForFile(notFoundPath);
        fs.writeFileSync(notFoundPath, JSON.stringify(list, null, 2));
    }
}

const PAGE_RESTART_INTERVAL  = 300;
const BROWSER_RESTART_INTERVAL = parseInt(process.env.BROWSER_RESTART_INTERVAL || "1000", 10);
const WORKER_COUNT           = Math.max(1, parseInt(process.env.SCRAPER_WORKERS || "1", 10));
const DETACHED_FRAME_PATTERN = /detached frame/i;
const BLOCKED_RESOURCE_TYPES = new Set(["image", "media", "font"]);
const BLOCKED_URL_PATTERNS   = ["google-analytics.com", "googletagmanager.com", "hotjar.com", "connect.facebook.net", "doubleclick.net", "adservice.google.com"];
const NO_INTERCEPTION_MARKETS = new Set(["trendyol"]);
const FALLBACK_MARKET        = "marketKarsilastir";
const slowMarkets            = new Set(["carrefour", "sokMarket"]);

async function setupPage(page, marketName = null) {
    await page.setUserAgent(USER_AGENT);
    if (marketName && NO_INTERCEPTION_MARKETS.has(marketName)) return;
    await page.setRequestInterception(true);
    page.on("request", (req) => {
        if (BLOCKED_RESOURCE_TYPES.has(req.resourceType())) return req.abort();
        if (BLOCKED_URL_PATTERNS.some(p => req.url().includes(p))) return req.abort();
        req.continue();
    });
}

async function createPages(browser) {
    const pages = {};
    for (const marketName of Object.keys(MARKETS)) {
        const page = await browser.newPage();
        await setupPage(page, marketName);
        pages[marketName] = page;
    }
    const breadcrumbPage = await browser.newPage();
    await setupPage(breadcrumbPage, "trendyol");
    pages._breadcrumb = breadcrumbPage;
    return pages;
}

async function recreatePage(browser, pages, marketName) {
    try { await pages[marketName].close(); } catch {}
    const newPage = await browser.newPage();
    await setupPage(newPage, marketName);
    pages[marketName] = newPage;
    return newPage;
}

async function fetchBreadcrumb(breadcrumbPage, marketName, productUrl) {
    if (!breadcrumbPage || !breadcrumbParsers[marketName]) return [];
    try {
        await breadcrumbPage.goto(productUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
        const waitSel = breadcrumbWaitSelectors[marketName];
        if (waitSel) { try { await breadcrumbPage.waitForSelector(waitSel, { timeout: 12000 }); } catch {} }
        const $detail = cheerio.load(await breadcrumbPage.content());
        const result = breadcrumbParsers[marketName]($detail) || [];
        await breadcrumbPage.goto("about:blank", { timeout: 3000 }).catch(() => {});
        return result;
    } catch { return []; }
}

async function releaseOtherPages(pages, winningMarket) {
    await Promise.allSettled(
        Object.entries(pages)
            .filter(([name]) => name !== winningMarket && name !== "_breadcrumb")
            .map(([, page]) => page.goto("about:blank", { timeout: 2000 }).catch(() => {}))
    );
}

async function restartAllPages(browser, pages) {
    for (const marketName of Object.keys(pages)) {
        try { await pages[marketName].close(); } catch {}
    }
    const fresh = await createPages(browser);
    for (const marketName of Object.keys(fresh)) {
        pages[marketName] = fresh[marketName];
    }
    console.log("[RESTART] Tüm sayfalar yeniden oluşturuldu.");
}

async function doFetchForMarket(page, marketName, barcode, winner, pages, browser) {
    const timeout = slowMarkets.has(marketName) ? 18000 : 12000;
    await page.goto(MARKETS[marketName].searchUrl(barcode), { waitUntil: "domcontentloaded", timeout });
    if (winner.value) return;
    const $ = cheerio.load(await page.content());
    const items = parsers[marketName]($);
    if (items && items.length && items[0].productPrice) {
        items[0].productPrice = normalizePrice(items[0].productPrice);
        const rawUrl = items[0].productUrl;
        delete items[0].productUrl;
        if (winner.value) return;
        winner.value = { success: true, site: marketName, barcode, product: { ...items[0], categoryPath: [] } };
        await releaseOtherPages(pages, marketName);
        let categoryPath = items[0].categoryPath || [];
        if (rawUrl && breadcrumbParsers[marketName]) {
            const productUrl = resolveUrl(marketName, rawUrl);
            if (productUrl) categoryPath = await fetchBreadcrumb(pages._breadcrumb, marketName, productUrl);
        }
        winner.value.product.categoryPath = categoryPath;
        addProductList(winner.value);
        console.log(`[OK] ${marketName} -> ${barcode}`);
    }
}

async function tryMarket(marketName, page, barcode, winner, pages, browser) {
    try {
        await doFetchForMarket(page, marketName, barcode, winner, pages, browser);
    } catch (err) {
        if (DETACHED_FRAME_PATTERN.test(err.message) && browser) {
            try {
                const newPage = await recreatePage(browser, pages, marketName);
                await doFetchForMarket(newPage, marketName, barcode, winner, pages, browser);
            } catch (retryErr) {
                if (!winner.value) console.warn(`[WARN] ${marketName}: ${retryErr.message}`);
            }
        } else {
            if (!winner.value) console.warn(`[WARN] ${marketName}: ${err.message}`);
        }
    }
}

async function fetchBarcode(barcode, pages, browser) {
    const mainEntries = Object.entries(pages).filter(([name]) => name !== "_breadcrumb" && name !== FALLBACK_MARKET);
    const winner = { value: null };
    await Promise.allSettled(mainEntries.map(([marketName, page]) => tryMarket(marketName, page, barcode, winner, pages, browser)));
    if (!winner.value && pages[FALLBACK_MARKET]) {
        await tryMarket(FALLBACK_MARKET, pages[FALLBACK_MARKET], barcode, winner, pages, browser);
    }
    if (!winner.value) {
        winner.value = { success: false, barcode, message: "Ürün bulunamadı" };
        addNotFoundBarcode(barcode);
        console.log(`[NOT FOUND] ${barcode}`);
    }
    return winner.value;
}

async function fetchBarcodes(barcodes, onResult = null) {
    const productList  = loadProductList();
    const existingMap  = new Map(productList.map(p => [String(p.barcode), p]));
    const notFoundSet  = new Set(loadNotFoundBarcodes().map(b => String(b)));

    const toFetch         = barcodes.filter(b => !existingMap.has(String(b)) && !notFoundSet.has(String(b)));
    const skippedFound    = barcodes.filter(b => existingMap.has(String(b))).length;
    const skippedNotFound = barcodes.filter(b => notFoundSet.has(String(b))).length;

    if (skippedFound    > 0) console.log(`[SKIP] ${skippedFound} barkod zaten bulunmuş.`);
    if (skippedNotFound > 0) console.log(`[SKIP] ${skippedNotFound} barkod daha önce bulunamadı olarak işaretli, atlanıyor.`);

    const results = [];

    for (const barcode of barcodes) {
        if (existingMap.has(String(barcode))) {
            const result = { ...existingMap.get(String(barcode)), success: true };
            if (onResult) onResult(result);
            results.push(result);
        }
    }

    if (toFetch.length === 0) return results;

    const queue = [...toFetch];
    let fetchCount = 0;

    async function workerRun() {
        let browser = await launchBrowser();
        let pages   = await createPages(browser);
        console.log(`[START] Worker başlatıldı, ${Object.keys(pages).length} tab. ${toFetch.length} barkod işlenecek.`);
        let localCount = 0;
        try {
            while (queue.length > 0) {
                const barcode = queue.shift();
                if (!barcode) break;
                fetchCount++;
                localCount++;
                console.log(`[${fetchCount}/${toFetch.length}] -> ${barcode}`);
                if (localCount % BROWSER_RESTART_INTERVAL === 0) {
                    for (const page of Object.values(pages)) await page.close().catch(() => {});
                    await browser.close().catch(() => {});
                    browser = await launchBrowser();
                    pages   = await createPages(browser);
                } else if (localCount % PAGE_RESTART_INTERVAL === 0) {
                    await restartAllPages(browser, pages);
                }
                const result = await fetchBarcode(barcode, pages, browser);
                if (onResult) onResult(result);
                results.push(result);
            }
        } finally {
            for (const page of Object.values(pages)) await page.close().catch(() => {});
            await browser.close().catch(() => {});
        }
    }

    console.log(`[INIT] ${WORKER_COUNT} worker başlatılıyor...`);
    await Promise.all(Array.from({ length: WORKER_COUNT }, () => workerRun()));
    return results;
}

module.exports = { fetchBarcodes };

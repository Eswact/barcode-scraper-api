const express = require("express");
const router  = express.Router();
const { MARKETS, scrapeSinglePage, fetchBarcodePricesParallel, launchBrowser } = require("../scrapers/priceScraper");
const { cacheGet, cacheSet, CACHE_NULL } = require("../cache/redisCache");
const { validateBarcodes, sseHeaders, send } = require("../utils/sse");

// POST /api/prices/search — toplu, tek yanıt
router.post("/search", async (req, res) => {
    const barcodes = validateBarcodes(req);
    if (!barcodes) return res.status(400).json({ status: "error", message: "Geçerli barkod listesi gönderilmedi" });

    try {
        const browser = await launchBrowser();
        const results = [];
        for (const barcode of barcodes) {
            console.log(`[prices] Aranıyor: ${barcode}`);
            results.push(await fetchBarcodePricesParallel(barcode, browser));
        }
        await browser.close();
        const foundCount = results.filter(r => Object.keys(r.prices).length > 0).length;
        res.json({ status: "success", message: `${barcodes.length} barkoddan ${foundCount} tanesi bulundu.`, totalBarcodes: barcodes.length, foundCount, results });
    } catch (error) {
        console.error("[prices] Hata:", error);
        res.status(500).json({ status: "error", message: "Sunucu hatası oluştu." });
    }
});

// POST /api/prices/search-stream — barkod barkod SSE
router.post("/search-stream", async (req, res) => {
    sseHeaders(res);
    const barcodes = validateBarcodes(req);
    if (!barcodes) { send(res, { type: "error", message: "Geçerli barkod listesi gönderilmedi" }); res.end(); return; }

    try {
        const browser = await launchBrowser();
        for (let i = 0; i < barcodes.length; i++) {
            const barcode = barcodes[i];
            send(res, { type: "progress", current: i + 1, total: barcodes.length, barcode });
            const result = await fetchBarcodePricesParallel(barcode, browser);
            send(res, { type: "result", data: result });
        }
        await browser.close();
        send(res, { type: "complete", message: `${barcodes.length} barkodun taraması tamamlandı.`, totalBarcodes: barcodes.length });
        res.end();
    } catch (error) {
        console.error("[prices] Hata:", error);
        send(res, { type: "error", message: "Sunucu hatası oluştu." });
        res.end();
    }
});

// POST /api/prices/search-stream-fast — platform başına tek tab, Redis cache
router.post("/search-stream-fast", async (req, res) => {
    sseHeaders(res);
    const barcodes = validateBarcodes(req);
    if (!barcodes) { send(res, { type: "error", message: "Geçerli barkod listesi gönderilmedi" }); res.end(); return; }

    const BLOCKED = new Set(["image", "stylesheet", "font", "media"]);

    // Chrome sadece browser marketler için ve ilk ihtiyaçta başlatılır; HTTP marketler beklemez
    let browserPromise = null;
    const getBrowser = () => (browserPromise ??= launchBrowser());

    try {
        await Promise.all(
            Object.entries(MARKETS).map(async ([market, cfg]) => {
                const createPage = async () => {
                    const p = await (await getBrowser()).newPage();
                    await p.setRequestInterception(true);
                    p.on("request", (req) => BLOCKED.has(req.resourceType()) ? req.abort() : req.continue());
                    return p;
                };

                // Opened lazily so fully-cached markets never create a tab
                let page = null;
                let consecutiveFailures = 0;

                for (const barcode of barcodes) {
                    const cacheKey = `price:${barcode}:${market}`;
                    const cached = await cacheGet(cacheKey);
                    if (cached !== null) {
                        send(res, { type: "result", barcode, platform: market, price: cached === CACHE_NULL ? null : cached, fromCache: true });
                        continue;
                    }

                    let price = null;
                    try {
                        if (cfg.browser && !page) {
                            page = await createPage();
                        } else if (cfg.browser && consecutiveFailures >= 2) {
                            await page.close().catch(() => {});
                            page = await createPage();
                            consecutiveFailures = 0;
                        }

                        if (cfg.waitMs > 0) await new Promise(resolve => setTimeout(resolve, cfg.waitMs));

                        price = await scrapeSinglePage(page, market, cfg.searchUrl(barcode));
                    } catch (err) {
                        // Chrome başlatılamazsa sadece bu market etkilenir, HTTP sonuçları akmaya devam eder
                        console.warn(`[prices] ${market} hata: ${err.message.split("\n")[0]}`);
                    }
                    price ? consecutiveFailures = 0 : consecutiveFailures++;
                    await cacheSet(cacheKey, price);
                    send(res, { type: "result", barcode, platform: market, price: price || null });
                }

                if (page) await page.close().catch(() => {});
            })
        );

        if (browserPromise) await browserPromise.then(b => b.close()).catch(() => {});
        send(res, { type: "complete", message: `${barcodes.length} barkodun taraması tamamlandı.`, totalBarcodes: barcodes.length, totalPlatforms: Object.keys(MARKETS).length });
        res.end();
    } catch (error) {
        console.error("[prices] Hata:", error);
        send(res, { type: "error", message: "Sunucu hatası oluştu." });
        res.end();
    }
});

module.exports = router;

const cheerio = require("cheerio");
const { MARKETS } = require("../config/markets");
const { USER_AGENT, launchBrowser } = require("./browser");
const { normalizePrice } = require("../utils/price");

const parsers = {
    trendyol: ($) => {
        if ($(".did-you-mean .information-banner .information-text").text().includes("bulunamadı")) return false;
        return $(".product-card").get().map((el) =>
            $(el).find(".single-price .price-section").text().trim() || ""
        );
    },
    hepsiburada: ($) => {
        if ($(".SearchResultSummary")) {
            return $(".ProductList ul li").get().map((el, i) =>
                $(el).find(`div[data-test-id="final-price-${i + 1}"]`).text().trim() || ""
            );
        }
        return false;
    },
    pazarama: ($) => {
        if ($(".product-card").get().length > 1) return false;
        return $(".product-card").get().map((el) =>
            $(el).find(".product-card__price .leading-tight").text().trim() || ""
        );
    },
    carrefour: ($) => {
        if ($(".product-listing .product-listing-item .hover-box").get().length > 1) return false;
        return $(".product-listing .product-listing-item .hover-box").get().map((el) => {
            const priceText = $(el).find(".item-price").clone().children().remove().end().text().trim();
            return priceText + $(el).find(".item-price .formatted-price").text().replace(/\D/g, "");
        });
    },
    mopas: ($) => {
        if ($(".product-list-grid .card").get().length > 1) return false;
        return $(".product-list-grid .card").get().map((el) =>
            $(el).find(".sale-price").text().trim() || ""
        );
    },
    aftaMarket: ($) => {
        if ($(".catalogWrapper .productItem").get().length > 1) return false;
        return $(".catalogWrapper .productItem").get().map((el) =>
            $(el).find(".productPrice .currentPrice").text().trim() || ""
        );
    },
    sokMarket: ($) => {
        if ($('p:contains("İlgili Sonuç Bulunamadı")').length > 0) return false;
        if ($('p:contains("0 adet ürün listelendi")').length > 0) return false;
        const cards = $(".CProductCard-module_productCardWrapper__okAmT, [class*='productCardWrapper']");
        if (cards.length === 0) return false;
        return cards.get().map((el) =>
            $(el).find("[class*='CPriceBox-module_price'], .CPriceBox-module_price__bYk-c").first().text().trim() || ""
        );
    },
    marketKarsilastir: ($) => {
        const cards = $(".product-card").get();
        if (cards.length === 0) return false;
        return cards.slice(0, 1).map((el) =>
            $(el).find(".product-price-badge").clone().children("small").remove().end().text().trim() || ""
        );
    },
};

function extractFirstPrice(parsed) {
    if (!parsed || parsed === false || !parsed.length) return null;
    return normalizePrice(parsed[0]);
}

async function scrapeSinglePage(page, market, url) {
    try {
        await page.setUserAgent(USER_AGENT);
        const timeout = MARKETS[market]?.timeout ?? 8000;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout });
        const $ = cheerio.load(await page.content());
        return extractFirstPrice(parsers[market]($));
    } catch (err) {
        console.warn(`[prices] ${market} hata: ${err.message}`);
        return null;
    }
}

async function fetchBarcodePricesParallel(barcode, browser) {
    const prices = {};
    const notFoundMarkets = [];

    await Promise.all(
        Object.entries(MARKETS).map(async ([market, cfg]) => {
            try {
                const page = await browser.newPage();
                await page.setRequestInterception(true);
                page.on("request", (req) => {
                    if (["image", "stylesheet", "font", "media"].includes(req.resourceType())) req.abort();
                    else req.continue();
                });
                const price = await scrapeSinglePage(page, market, cfg.searchUrl(barcode));
                await page.close();
                if (price) prices[market] = price;
                else notFoundMarkets.push(market);
            } catch (err) {
                console.error(`[prices] ${market} hatası:`, err.message);
                notFoundMarkets.push(market);
            }
        })
    );

    return { barcode, prices, notFoundMarkets };
}

module.exports = { MARKETS, scrapeSinglePage, fetchBarcodePricesParallel, launchBrowser };

const MARKETS = {
    trendyol: {
        searchUrl: b => `https://www.trendyol.com/sr?q=${b}`,
        baseUrl:   "https://www.trendyol.com",
        timeout:   8000,
        waitMs:    0,
    },
    hepsiburada: {
        searchUrl: b => `https://www.hepsiburada.com/ara?q=${b}`,
        baseUrl:   "https://www.hepsiburada.com",
        timeout:   8000,
        waitMs:    0,
    },
    pazarama: {
        searchUrl: b => `https://www.pazarama.com/arama?q=${b}`,
        baseUrl:   "https://www.pazarama.com",
        timeout:   8000,
        waitMs:    0,
    },
    carrefour: {
        searchUrl: b => `https://www.carrefoursa.com/search/?text=${b}`,
        baseUrl:   "https://www.carrefoursa.com",
        timeout:   12000,
        waitMs:    1500,
    },
    mopas: {
        searchUrl: b => `https://mopas.com.tr/search/?text=${b}`,
        baseUrl:   "https://mopas.com.tr",
        timeout:   8000,
        waitMs:    0,
    },
    aftaMarket: {
        searchUrl: b => `https://www.aftamarket.com.tr/arama?q=${b}`,
        baseUrl:   "https://www.aftamarket.com.tr",
        timeout:   8000,
        waitMs:    0,
    },
    sokMarket: {
        searchUrl: b => `https://www.sokmarket.com.tr/arama?q=${b}`,
        baseUrl:   "https://www.sokmarket.com.tr",
        timeout:   8000,
        waitMs:    0,
    },
    marketKarsilastir: {
        searchUrl: b => `https://marketkarsilastir.com/ara?q=${b}&type=barcode`,
        baseUrl:   "https://marketkarsilastir.com",
        timeout:   12000,
        waitMs:    0,
    },
};

module.exports = { MARKETS };

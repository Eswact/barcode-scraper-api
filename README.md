# Barcode Scraper API

Real-time barcode price comparison and product lookup across 8 Turkish marketplaces. Built with Express, Puppeteer Extra (Stealth), and Redis.

**Supported platforms:** Trendyol · Hepsiburada · Pazarama · CarrefourSA · Mopaş · Afta Market · Şok Market · Market Karşılaştır

---

## Setup

```bash
npm install
```

Optional `.env`:

```env
PORT=3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_CACHE_TTL_HOURS=24
```

Redis is optional — the API works without it, caching is simply skipped.

```bash
npm run dev   # development (nodemon)
npm start     # production
```

UI available at `http://localhost:3000`

---

## Price Comparison

Scrapes all 8 platforms in parallel using one browser tab per platform. Results stream in real-time via SSE. The cheapest price is highlighted automatically and results can be exported to CSV.

Redis caches each `barcode:platform` pair for 24 hours. The system works without Redis — caching is simply skipped.

**Endpoint:** `POST /api/prices/search-stream-fast` — `{ "barcodes": ["8690504085720"] }`

---

## Product Info

Uses a winner-takes-all strategy: all platforms are scraped in parallel and the first one to find the product wins. The product page is then visited to extract the category breadcrumb path.

Found products are saved to `output/product-list.json` and served instantly on subsequent requests without re-scraping. Barcodes that return no results are saved to `output/not-found-barcodes.json` and skipped in future runs.

**Endpoint:** `POST /api/products/search` — `{ "barcodes": ["8690504085720"] }`

Returns: product name, image, price, category path, source platform.

---

## Scripts

| Command | Description |
|---|---|
| `npm run run-barcodes` | Scrape barcodes from `input/barcodes.json` via the API |
| `npm run download` | Download product images from `product-list.json` & create `updated-product-list.json` |
| `npm run to-csv` | Convert `updated-product-list.json` to CSV |
| `npm run info` | Show output folder statistics |

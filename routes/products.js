const express = require("express");
const router  = express.Router();
const productScraper = require("../scrapers/productScraper");
const { validateBarcodes, sseHeaders, send } = require("../utils/sse");

// POST /api/products/get-products — toplu, tek yanıt
router.post("/get-products", async (req, res) => {
    const barcodes = validateBarcodes(req);
    if (!barcodes) return res.status(400).json({ error: "Barkod listesi eksik." });
    try {
        const results = await productScraper.fetchBarcodes(barcodes);
        res.json(results);
    } catch (err) {
        console.error("[products] Hata:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/products/search — SSE streaming
router.post("/search", async (req, res) => {
    const barcodes = validateBarcodes(req);
    if (!barcodes) return res.status(400).json({ error: "Barkod listesi eksik." });

    sseHeaders(res);
    res.flushHeaders();

    try {
        await productScraper.fetchBarcodes(barcodes, (result) => {
            send(res, { type: "result", ...result });
        });
    } catch (err) {
        console.error("[products] SSE hatası:", err.message);
        send(res, { type: "error", message: err.message });
    } finally {
        send(res, { type: "complete" });
        res.end();
    }
});

module.exports = router;

function normalizePrice(price) {
    if (typeof price === "number") return price.toFixed(2);
    if (!price) return null;
    let cleaned = String(price).replace(/[^0-9.,]/g, "").trim();
    if (cleaned.includes(",")) {
        // Turkish format: dot = thousands separator, comma = decimal separator
        cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
        // No comma, dot-grouped thousands only (e.g. Trendyol "2.299 TL")
        cleaned = cleaned.replace(/\./g, "");
    }
    // Otherwise: dot is already the decimal separator — leave as-is
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed.toFixed(2);
}

module.exports = { normalizePrice };

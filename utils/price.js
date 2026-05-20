function normalizePrice(price) {
    if (typeof price === "number") return price.toFixed(2);
    if (!price) return null;
    let cleaned = String(price).replace(/[^0-9.,]/g, "").trim();
    if (cleaned.includes(",")) {
        // Turkish format: dot = thousands separator, comma = decimal separator
        cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    }
    // No comma: dot is already the decimal separator — leave as-is
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed.toFixed(2);
}

module.exports = { normalizePrice };

function validateBarcodes(req) {
    const { barcodes } = req.body;
    if (!barcodes || !Array.isArray(barcodes) || barcodes.length === 0) return null;
    return barcodes;
}

function sseHeaders(res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
}

function send(res, data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

module.exports = { validateBarcodes, sseHeaders, send };

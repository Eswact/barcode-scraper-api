const axios = require("axios");
const { USER_AGENT } = require("./browser");

// Server-rendered sitelerde Chrome yerine düz HTTP: aynı HTML, çok daha az CPU/RAM.
const HEADERS = {
    "User-Agent":      USER_AGENT,
    "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
};

async function fetchHtml(url, timeout) {
    // axios `timeout` Node'da sadece soket boşta kalma süresi; signal toplam süreyi sınırlar
    const res = await axios.get(url, { headers: HEADERS, timeout, signal: AbortSignal.timeout(timeout), responseType: "text", maxRedirects: 5 });
    return res.data;
}

module.exports = { fetchHtml };

const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin  = require("puppeteer-extra-plugin-stealth");

puppeteerExtra.use(StealthPlugin());

// Puppeteer'ın indirdiği Chrome sürümüyle uyumlu tutun; Hepsiburada eski sürümlü UA'ları (örn. Chrome/123) 403 ile engelliyor
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36";

const BROWSER_ARGS = [
    "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
    "--disable-gpu", "--disable-extensions", "--disable-background-networking",
    "--disable-sync", "--disable-translate", "--mute-audio", "--no-first-run",
    "--hide-scrollbars", "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding",
];

async function launchBrowser() {
    // Takılan bir CDP komutu varsayılan 180 sn yerine 30 sn'de hata versin
    return puppeteerExtra.launch({ headless: true, args: BROWSER_ARGS, protocolTimeout: 30000 });
}

module.exports = { USER_AGENT, BROWSER_ARGS, launchBrowser };

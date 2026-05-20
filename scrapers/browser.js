const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin  = require("puppeteer-extra-plugin-stealth");

puppeteerExtra.use(StealthPlugin());

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const BROWSER_ARGS = [
    "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
    "--disable-gpu", "--disable-extensions", "--disable-background-networking",
    "--disable-sync", "--disable-translate", "--mute-audio", "--no-first-run",
    "--hide-scrollbars", "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding",
];

async function launchBrowser() {
    return puppeteerExtra.launch({ headless: true, args: BROWSER_ARGS });
}

module.exports = { USER_AGENT, BROWSER_ARGS, launchBrowser };

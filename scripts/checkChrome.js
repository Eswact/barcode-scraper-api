// Build sonrasi Chrome'un gercekten calistigini dogrular.
// `puppeteer browsers install` zip'i acamazsa (or. Node 26 + extract-zip) hata vermeden
// cikiyor ve yarim kalan kurulum ancak runtime'da "Could not find Chrome" olarak gorunuyor.
// Sadece dosya varligi yetmiyor (ana binary acilmis, framework/lib'ler eksik olabiliyor),
// bu yuzden tarayiciyi gercekten baslatip kapatiyoruz.
const { launchBrowser } = require("../scrapers/browser");

(async () => {
    try {
        const browser = await launchBrowser();
        const version = await browser.version();
        await browser.close();
        console.log(`Chrome hazir: ${version}`);
    } catch (err) {
        console.error(`Chrome baslatilamadi (Node ${process.version}): ${err.message.split("\n")[0]}`);
        console.error(`Kurulum zip'i acilamamis olabilir; package.json "engines.node" surumunu kullanin.`);
        process.exit(1);
    }
})();

const { join } = require("path");

// Render'da ~/.cache build sonrası silinir; sadece proje dizini kalıcıdır.
// Chrome'u proje içine indirip runtime'da oradan çözümlüyoruz.
module.exports = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};

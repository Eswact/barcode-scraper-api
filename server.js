require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { ensureOutputDir } = require("./scripts/datasFs");
const { checkRedis } = require("./cache/redisCache");
const priceRoutes = require("./routes/prices");
const productRoutes = require("./routes/products");

ensureOutputDir();
checkRedis();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/prices", priceRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Barcode Scraper API: http://localhost:${PORT}`));

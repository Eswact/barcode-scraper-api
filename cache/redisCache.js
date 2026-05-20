const fs = require("fs");
const path = require("path");
const Redis = require("ioredis");

const CACHE_TTL = 60 * 60 * (parseInt(process.env.REDIS_CACHE_TTL_HOURS, 10) || 24);
const CACHE_NULL = "__null__";
const LOG_PATH = path.join(__dirname, "..", "redis-log.txt");

function logRedisError(context, err) {
    const ts = new Date().toISOString();
    const detail = err && (err.stack || err.message) ? (err.stack || err.message) : String(err);
    console.warn("[Redis] Hata:", context, err && err.message ? err.message : err);
    try {
        fs.appendFileSync(LOG_PATH, `[${ts}] ${context}\n${detail}\n---\n`, "utf8");
    } catch {}
}

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 2000)),
});

let redisAvailable = false;

redis.on("error", (err) => {
    if (redisAvailable) logRedisError("Bağlantı kesildi", err);
    redisAvailable = false;
});

redis.on("ready", () => {
    redisAvailable = true;
    console.log(`[Redis] Bağlantı başarılı — cache aktif (TTL: ${CACHE_TTL / 3600}s)`);
});

async function checkRedis() {
    try {
        await redis.ping();
        redisAvailable = true;
        console.log(`[Redis] Bağlantı başarılı — cache aktif (TTL: ${CACHE_TTL / 3600}h)`);
    } catch {
        console.warn("[Redis] Bağlanamadı");
    }
}

async function cacheGet(key) {
    if (!redisAvailable) return null;
    try { return await redis.get(key); }
    catch (err) { logRedisError(`cacheGet (key: ${key})`, err); return null; }
}

async function cacheSet(key, value) {
    if (!redisAvailable) return;
    try { await redis.setex(key, CACHE_TTL, value ?? CACHE_NULL); }
    catch (err) { logRedisError(`cacheSet (key: ${key})`, err); }
}

module.exports = { cacheGet, cacheSet, CACHE_NULL, checkRedis };

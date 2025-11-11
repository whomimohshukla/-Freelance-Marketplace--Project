// Simple in-memory rate limiter per IP+route
// windowMs: time window in ms, max: max requests per window
const buckets = new Map();

function key(ip, route) {
  return `${ip}::${route}`;
}

module.exports = function rateLimit({ windowMs = 60_000, max = 20 } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const k = key(ip, req.baseUrl + req.path);
    const now = Date.now();
    const entry = buckets.get(k) || { count: 0, reset: now + windowMs };
    if (now > entry.reset) {
      entry.count = 0;
      entry.reset = now + windowMs;
    }
    entry.count += 1;
    buckets.set(k, entry);
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.set('X-RateLimit-Reset', String(Math.ceil(entry.reset / 1000)));
    if (entry.count > max) {
      return res.status(429).json({ success: false, message: 'Too many requests, please try again later.' });
    }
    next();
  };
};

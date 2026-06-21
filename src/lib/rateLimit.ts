import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number[]>({
  max: 1000, // max distinct IPs to track
  ttl: 15 * 60 * 1000, // 15 minutes default TTL
});

interface RateLimiterOptions {
  limit: number; // max requests allowed per window
  windowMs: number; // window size in milliseconds
}

export function rateLimiter(options: RateLimiterOptions) {
  return (ip: string) => {
    const now = Date.now();
    const windowStart = now - options.windowMs;

    let requestTimestamps = rateLimitCache.get(ip) || [];

    // Filter out timestamps outside the current sliding window
    requestTimestamps = requestTimestamps.filter((timestamp) => timestamp > windowStart);

    if (requestTimestamps.length >= options.limit) {
      const resetTime = requestTimestamps[0] + options.windowMs;
      return {
        success: false,
        limit: options.limit,
        remaining: 0,
        reset: resetTime,
      };
    }

    // Add current timestamp
    requestTimestamps.push(now);
    rateLimitCache.set(ip, requestTimestamps);

    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - requestTimestamps.length,
      reset: now + options.windowMs,
    };
  };
}

import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number[]>({
  max: 1000,
  ttl: 15 * 60 * 1000,
});

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
}

export function rateLimiter(options: RateLimiterOptions) {
  return (ip: string) => {
    const now = Date.now();
    const windowStart = now - options.windowMs;

    let requestTimestamps = rateLimitCache.get(ip) || [];

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

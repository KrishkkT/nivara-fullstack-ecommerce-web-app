// Simple in-memory rate limiter for API routes
// Note: For production, use Redis or a database for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window

export function rateLimit(ip: string, maxRequests: number = RATE_LIMIT_MAX_REQUESTS): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = ip;
  
  let entry = rateLimits.get(key);
  
  // Reset if window has expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW
    };
    rateLimits.set(key, entry);
  }
  
  // Increment request count
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }
  
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    if (entry.resetTime < now) {
      rateLimits.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute
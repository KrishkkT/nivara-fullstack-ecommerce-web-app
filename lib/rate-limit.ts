// Simple in-memory rate limiter
// Note: For production, use Redis or another distributed cache

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000) // Every minute
  }

  // Check if identifier is allowed to make a request
  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    // If no entry or expired, create new entry
    if (!entry || entry.resetTime <= now) {
      const resetTime = now + this.windowMs
      this.limits.set(identifier, {
        count: 1,
        resetTime
      })
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime
      }
    }

    // Increment count
    if (entry.count < this.maxRequests) {
      entry.count++
      return {
        allowed: true,
        remaining: this.maxRequests - entry.count,
        resetTime: entry.resetTime
      }
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }

  // Clean up expired entries
  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime <= now) {
        this.limits.delete(key)
      }
    }
  }

  // Get current rate limit status
  getStatus(identifier: string) {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || entry.resetTime <= now) {
      return {
        remaining: this.maxRequests,
        resetTime: now + this.windowMs,
        total: this.maxRequests
      }
    }

    return {
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
      total: this.maxRequests
    }
  }
}

// Create rate limiters for different purposes
export const otpRateLimiter = new RateLimiter(5 * 60 * 1000, 3) // 3 requests per 5 minutes
export const authRateLimiter = new RateLimiter(15 * 60 * 1000, 10) // 10 requests per 15 minutes
export const generalRateLimiter = new RateLimiter(60 * 1000, 100) // 100 requests per minute
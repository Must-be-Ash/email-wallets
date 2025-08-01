import { getDatabase } from './mongodb';

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: Date;
}

export class MongoRateLimit {
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 2) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const db = await getDatabase();
    const collection = db.collection('rate_limits');
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - this.windowMs);
    
    // Remove expired entries
    await collection.deleteMany({
      identifier,
      timestamp: { $lt: windowStart }
    });
    
    // Count current requests in window
    const currentCount = await collection.countDocuments({
      identifier,
      timestamp: { $gte: windowStart }
    });
    
    if (currentCount >= this.maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset: new Date(now.getTime() + this.windowMs)
      };
    }
    
    // Add current request
    await collection.insertOne({
      identifier,
      timestamp: now
    });
    
    return {
      success: true,
      remaining: this.maxRequests - currentCount - 1,
      reset: new Date(now.getTime() + this.windowMs)
    };
  }
}
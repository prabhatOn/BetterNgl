import Redis from 'ioredis';

const redis = new Redis();

type RateLimitOptions = {
    windowMs: number;
    max: number;
    message: string;
};

class RateLimiter {
    private windowMs: number;
    private max: number;
    private message: string;

    constructor(options: RateLimitOptions) {
        this.windowMs = options.windowMs;
        this.max = options.max;
        this.message = options.message;
    }

    async isRateLimited(ip: string): Promise<boolean> {
        const currentTime = Date.now();
        const rateLimitKey = `rate-limit:${ip}`;
        
        let record = await redis.get(rateLimitKey);
        if (!record) {
            // No record found, initialize it
            await redis.set(rateLimitKey, JSON.stringify({ count: 1, firstRequest: currentTime }), 'PX', this.windowMs);
            return false;
        }

        let { count, firstRequest } = JSON.parse(record);
        count += 1;

        if (currentTime - firstRequest > this.windowMs) {
            // Reset the count and timestamp if window has passed
            await redis.set(rateLimitKey, JSON.stringify({ count: 1, firstRequest: currentTime }), 'PX', this.windowMs);
            return false;
        }

        if (count > this.max) {
            return true;
        }

        // Update the count
        await redis.set(rateLimitKey, JSON.stringify({ count, firstRequest }), 'PX', this.windowMs);
        return false;
    }
}

const rateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});

export default rateLimiter;

// lib/rateLimiter.ts
import { NextRequest } from 'next/server';

type RateLimitOptions = {
    windowMs: number;
    max: number;
    message: string;
};

class RateLimiter {
    private requests: Map<string, { count: number; firstRequest: number }> = new Map();
    private windowMs: number;
    private max: number;
    private message: string;

    constructor(options: RateLimitOptions) {
        this.windowMs = options.windowMs;
        this.max = options.max;
        this.message = options.message;
    }

    isRateLimited(ip: string): boolean {
        const currentTime = Date.now();
        const record = this.requests.get(ip);

        if (!record) {
            this.requests.set(ip, { count: 1, firstRequest: currentTime });
            return false;
        }

        if (currentTime - record.firstRequest > this.windowMs) {
            // Reset the count and timestamp
            this.requests.set(ip, { count: 1, firstRequest: currentTime });
            return false;
        }

        record.count += 1;

        if (record.count > this.max) {
            return true;
        }

        this.requests.set(ip, record);
        return false;
    }
}

const rateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});

export default rateLimiter;

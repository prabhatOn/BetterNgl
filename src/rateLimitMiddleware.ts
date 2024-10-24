import { NextRequest, NextResponse } from 'next/server';
import { getClientIP } from '@/utils/getClientIP';

type RateLimitEntry = {
    count: number;
    firstRequest: number;
};
const rateLimitStore: Record<string, RateLimitEntry> = {};

class RateLimiter {
    private windowMs: number;
    private max: number;
    private errorMessage: string;

    constructor(windowMs: number, max: number, errorMessage: string) {
        this.windowMs = windowMs;
        this.max = max;
        this.errorMessage = errorMessage; 
    }

    async isRateLimited(ip: string): Promise<boolean> {
        const currentTime = Date.now();
        const rateLimitEntry = rateLimitStore[ip];

        if (!rateLimitEntry) {
            rateLimitStore[ip] = {
                count: 1,
                firstRequest: currentTime,
            };
            return false;
        }

        const { count, firstRequest } = rateLimitEntry;

        if (currentTime - firstRequest > this.windowMs) {
            rateLimitStore[ip] = {
                count: 1,
                firstRequest: currentTime,
            };
            return false;
        }

        if (count >= this.max) {
            return true;
        }
        rateLimitStore[ip].count += 1;
        return false;
    }

    get message() {
        return this.errorMessage; 
    }
}
const rateLimiter = new RateLimiter(15 * 60 * 1000, 100, 'Too many requests, please try again later.');
export async function rateLimitMiddleware(req: NextRequest) {
    const clientIP = getClientIP(req) || 'unknown';

    if (await rateLimiter.isRateLimited(clientIP)) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: rateLimiter.message,
            }),
            { status: 429 }
        );
    }
    return NextResponse.next();
}

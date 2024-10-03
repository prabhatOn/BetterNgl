import { NextRequest, NextResponse } from 'next/server';
import { getClientIP } from '@/utils/getClientIP';

type RateLimitEntry = {
    count: number;
    firstRequest: number;
};

// In-memory store for rate-limiting
const rateLimitStore: Record<string, RateLimitEntry> = {};

class RateLimiter {
    private windowMs: number;
    private max: number;
    private errorMessage: string; // Renamed to avoid conflict

    constructor(windowMs: number, max: number, errorMessage: string) {
        this.windowMs = windowMs;
        this.max = max;
        this.errorMessage = errorMessage; // Assign to the renamed property
    }

    async isRateLimited(ip: string): Promise<boolean> {
        const currentTime = Date.now();
        const rateLimitEntry = rateLimitStore[ip];

        if (!rateLimitEntry) {
            // Initialize rate limit entry
            rateLimitStore[ip] = {
                count: 1,
                firstRequest: currentTime,
            };
            return false;
        }

        const { count, firstRequest } = rateLimitEntry;

        if (currentTime - firstRequest > this.windowMs) {
            // Reset count and time if window has passed
            rateLimitStore[ip] = {
                count: 1,
                firstRequest: currentTime,
            };
            return false;
        }

        if (count >= this.max) {
            return true;
        }

        // Increment request count
        rateLimitStore[ip].count += 1;
        return false;
    }

    get message() {
        return this.errorMessage; // Return the renamed property
    }
}

// Instantiate the rate limiter with specific settings
const rateLimiter = new RateLimiter(15 * 60 * 1000, 100, 'Too many requests, please try again later.');

// Middleware function to apply rate limiting
export async function rateLimitMiddleware(req: NextRequest) {
    const clientIP = getClientIP(req) || 'unknown';

    // Apply rate limiting
    if (await rateLimiter.isRateLimited(clientIP)) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: rateLimiter.message,
            }),
            { status: 429 }
        );
    }

    // If not rate-limited, proceed with the request
    return NextResponse.next();
}

// lib/rateLimiter.ts

import { NextRequest, NextResponse } from 'next/server';

const rateLimit = (limit: number, interval: number) => {
    const requests = new Map<string, number[]>();

    return async (req: NextRequest, res: NextResponse, next: () => void) => {
        const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

        const now = Date.now();
        const windowStart = now - interval;

        const recentRequests = requests.get(ip) || [];

        // Filter out old requests
        const updatedRequests = recentRequests.filter(time => time > windowStart);
        updatedRequests.push(now);

        requests.set(ip, updatedRequests);

        if (updatedRequests.length > limit) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Rate limit exceeded. Try again later.',
                },
                { status: 429 }
            );
        }

        // Call the next middleware function or endpoint handler
        return next();
    };
};

export default rateLimit;

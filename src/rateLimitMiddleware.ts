// middleware/rateLimitMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '@/lib/rateLimiter';
import { getClientIP } from '@/utils/getClientIP';

export async function rateLimitMiddleware(req: NextRequest) {
    const clientIP = getClientIP(req); // Now works with NextRequest

    if (rateLimiter.isRateLimited(clientIP || 'unknown')) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Too many requests, please try again later.',
            }),
            { status: 429 }
        );
    }

    // If not rate-limited, continue processing the request
    return NextResponse.next();
}

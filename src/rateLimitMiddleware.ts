import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '@/lib/rateLimiter';
import { getClientIP } from '@/utils/getClientIP';

// Example of a whitelist for trusted IPs
const IP_WHITELIST = ['127.0.0.1', 'your-admin-ip'];

export async function rateLimitMiddleware(req: NextRequest) {
    const clientIP = getClientIP(req) || 'unknown';

    // Bypass rate limiting for whitelisted IPs
    if (IP_WHITELIST.includes(clientIP)) {
        return NextResponse.next();
    }

    // Apply rate limiting for non-whitelisted IPs
    if (await rateLimiter.isRateLimited(clientIP)) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: rateLimiter['message'],
            }),
            { status: 429 }
        );
    }

    // If not rate-limited, continue processing the request
    return NextResponse.next();
}

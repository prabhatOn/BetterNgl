// utils/getClientIP.ts

import { NextRequest } from 'next/server';

// Function to extract client's IP from the request
export function getClientIP(req: NextRequest): string | undefined {
    // Try to get IP address from the request headers (in case of a reverse proxy or cloud provider)
    const forwardedFor = req.headers.get('x-forwarded-for');

    if (forwardedFor) {
        // 'x-forwarded-for' may contain a comma-separated list of IPs, so we grab the first one
        return forwardedFor.split(',')[0].trim();
    }

    // Fallback: Try to get the client's IP from the `req.ip` field, if available (not always set)
    return req.ip;
}

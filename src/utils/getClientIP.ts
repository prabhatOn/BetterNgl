import { NextRequest } from 'next/server';

export function getClientIP(req: NextRequest): string | undefined {
    // Try to get IP address from reverse proxies like Cloudflare, AWS, or others
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // 'x-forwarded-for' may contain a comma-separated list of IPs (in case of proxies)
        return forwardedFor.split(',')[0].trim();
    }

    // Fallback to remote address
    const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || req.headers.get('remote-address');
    
    return ip || undefined; // Return undefined if not found
}

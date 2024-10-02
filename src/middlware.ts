import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimitMiddleware } from './rateLimitMiddleware';
import { getClientIP } from '@/utils/getClientIP';

export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
    // Apply rate limiting to sensitive routes
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) return rateLimitResult; // Return 429 response if rate-limited

    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // If user is authenticated, prevent them from accessing sign-in, sign-up, or verify pages
    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated, prevent access to dashboard routes
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // If everything is okay, proceed with the request
    return NextResponse.next();
}

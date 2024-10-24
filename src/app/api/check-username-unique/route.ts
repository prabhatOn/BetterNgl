import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';
import rateLimiter from '@/lib/rateLimiter';
import ipTracker from '@/lib/ipTracker';
import { timeoutPromise } from '@/lib/timeout';
import { getClientIP } from '@/utils/getClientIP';

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req: NextRequest) {
    const clientIP = getClientIP(req) || 'unknown';
    
    try {
        if (await rateLimiter.isRateLimited(clientIP)) {
            await handleRateLimit(clientIP);
            return sendRateLimitedResponse('Too many requests. Try again later.', 429);
        }
        await dbConnect();
        const username = req.nextUrl.searchParams.get('username');
        const parsedParams = await Promise.race([
            UsernameQuerySchema.safeParseAsync({ username }),
            timeoutPromise(5000),
        ]);

        if (!parsedParams.success) {
            await ipTracker.recordFailedAttempt(clientIP);
            const errorMessage = parsedParams.error.errors?.map(err => err.message).join(', ') || 'Invalid query parameters';
            return sendErrorResponse(errorMessage, 400);
        }
        const { username: validUsername } = parsedParams.data;
        const existingUser = await Promise.race([
            UserModel.findOne({ username: validUsername, isVerified: true }),
            timeoutPromise(5000),
        ]);

        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Username is already taken' }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: 'Username is unique' }, { status: 200 });
    } catch (error) {
        return handleUnexpectedError(error, clientIP);
    }
}
async function handleRateLimit(clientIP: string) {
    await ipTracker.recordFailedAttempt(clientIP);
    if (await ipTracker.isBlocked(clientIP)) {
        await ipTracker.blockIP(clientIP, 30 * 60 * 1000);  
    }
}
function sendRateLimitedResponse(message: string, status: number) {
    console.warn(message);
    return NextResponse.json({ success: false, message }, { status });
}

function sendErrorResponse(message: string, status: number) {
    console.error(message);
    return NextResponse.json({ success: false, message }, { status });
}

function handleUnexpectedError(error: any, clientIP: string) {
    if (error instanceof Error && error.message === 'Timeout') {
        console.error(`Request timeout for IP: ${clientIP}`);
        return sendErrorResponse('Service Unavailable', 503);
    }
    console.error('Unexpected error:', error);
    return sendErrorResponse('Internal Server Error', 500);
}

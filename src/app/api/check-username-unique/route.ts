import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';
import rateLimiter from '@/lib/rateLimiter';
import ipTracker from '@/lib/ipTracker';
import { timeoutPromise } from '@/lib/timeout';
import { getClientIP } from '@/utils/getClientIP';
type Data = {
    success: boolean;
    message: string;
};
const UsernameQuerySchema = z.object({
    username: usernameValidation,
});
export async function GET(req: NextRequest) {
    const clientIP = getClientIP(req) || 'unknown'; 
    if (await ipTracker.isBlocked(clientIP)) {
        console.warn(`Blocked IP due to failed attempts: ${clientIP}`);
        return NextResponse.json({ success: false, message: 'Too many invalid requests, please try again later.' }, { status: 429 });
    }
    if (await rateLimiter.isRateLimited(clientIP)) {
        console.warn(`Rate-limited request from IP: ${clientIP}`);
        await ipTracker.recordFailedAttempt(clientIP);  
        if (await ipTracker.isBlocked(clientIP)) {
            await ipTracker.blockIP(clientIP, 30 * 60 * 1000);
            console.warn(`IP blocked for 30 minutes: ${clientIP}`);
            return NextResponse.json({ success: false, message: 'Too many requests. You are blocked for 30 minutes.' }, { status: 429 });
        }

        return NextResponse.json({ success: false, message: rateLimiter['message'] }, { status: 429 });
    }
    try {
        await dbConnect();
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }

    try {
        const username = req.nextUrl.searchParams.get('username');
        const parsedParams = await Promise.race([
            UsernameQuerySchema.safeParseAsync({ username }),
            timeoutPromise(5000), 
        ]);

        if (!parsedParams.success) {
            await ipTracker.recordFailedAttempt(clientIP);
            console.warn(`Validation failed for IP: ${clientIP}, Username: ${username}`);

            const usernameErrors = parsedParams.error.format().username?._errors || [];
            const errorMessage =
                usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters';
            return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
        }
        await ipTracker.resetAttempts(clientIP);

        const { username: validUsername } = parsedParams.data;
        const existingVerifiedUser = await Promise.race([
            UserModel.findOne({ username: validUsername, isVerified: true }),
            timeoutPromise(5000), 
        ]);

        if (existingVerifiedUser) {
            return NextResponse.json({ success: false, message: 'Username is already taken' }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: 'Username is unique' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error && error.message === 'Timeout') {
            console.error(`Request timeout for IP: ${clientIP}`);
            return NextResponse.json({ success: false, message: 'Service Unavailable' }, { status: 503 });
        }
        console.error('Error checking username:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

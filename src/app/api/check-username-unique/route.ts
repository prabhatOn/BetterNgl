import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';
import rateLimiter from '@/lib/rateLimiter';
import ipTracker from '@/lib/ipTracker';
import { timeoutPromise } from '@/lib/timeout';
import { getClientIP } from '@/utils/getClientIP';
import Redis from 'ioredis';

// Create a Redis client
const redis = new Redis();

// Zod validation schema
const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req: NextRequest) {
    const clientIP = getClientIP(req) || 'unknown'; // Handle undefined IP

    if (ipTracker.isBlocked(clientIP)) {
        return NextResponse.json({ success: false, message: 'Too many invalid requests, please try again later.' }, { status: 429 });
    }

    if (rateLimiter.isRateLimited(clientIP)) {
        return NextResponse.json({ success: false, message: rateLimiter['message'] }, { status: 429 });
    }

    const username = req.nextUrl.searchParams.get('username');

    // Check if the username is null
    if (!username) {
        return NextResponse.json({ success: false, message: 'Username is required' }, { status: 400 });
    }

    // Check if the result is cached
    const cachedResult = await redis.get(username);
    if (cachedResult) {
        return NextResponse.json(JSON.parse(cachedResult));
    }

    // Connect to the database
    try {
        await dbConnect();
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }

    try {
        const parsedParams = await Promise.race([
            UsernameQuerySchema.safeParseAsync({ username }),
            timeoutPromise(5000),
        ]);

        if (!parsedParams.success) {
            ipTracker.recordFailedAttempt(clientIP);
            const usernameErrors = parsedParams.error.format().username?._errors || [];
            const errorMessage = usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters';
            return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
        }

        ipTracker.resetAttempts(clientIP);

        const { username: validUsername } = parsedParams.data;

        const existingVerifiedUser = await Promise.race([
            UserModel.findOne({ username: validUsername, isVerified: true }),
            timeoutPromise(5000),
        ]);

        if (existingVerifiedUser) {
            const response = { success: false, message: 'Username is already taken' };
            // Cache the result for future queries (10 seconds)
            await redis.set(username, JSON.stringify(response), 'EX', 10);
            return NextResponse.json(response, { status: 200 });
        }

        const response = { success: true, message: 'Username is unique' };
        // Cache the result for future queries (10 seconds)
        await redis.set(username, JSON.stringify(response), 'EX', 10);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        if (error instanceof Error && error.message === 'Timeout') {
            return NextResponse.json({ success: false, message: 'Service Unavailable' }, { status: 503 });
        }
        console.error('Error checking username:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

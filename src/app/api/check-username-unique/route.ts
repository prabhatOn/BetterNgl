import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';
import rateLimiter from '@/lib/rateLimiter';
import ipTracker from '@/lib/ipTracker';
import { timeoutPromise } from '@/lib/timeout';
import { getClientIP } from '@/utils/getClientIP';

// Define the response structure
type Data = {
    success: boolean;
    message: string;
};

// Zod validation schema
const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

// API route handler
export async function GET(req: NextRequest) {
    const clientIP = getClientIP(req) || 'unknown'; // Handle undefined IP

    // Check if the IP is blocked due to too many failed attempts
    if (await ipTracker.isBlocked(clientIP)) {
        // Log blocked attempt
        console.warn(`Blocked IP due to failed attempts: ${clientIP}`);
        return NextResponse.json({ success: false, message: 'Too many invalid requests, please try again later.' }, { status: 429 });
    }

    // Apply rate limiting
    if (await rateLimiter.isRateLimited(clientIP)) {
        // Log rate-limited attempt
        console.warn(`Rate-limited request from IP: ${clientIP}`);
        await ipTracker.recordFailedAttempt(clientIP);  // Record the failed attempt

        // If failed attempts exceed threshold, block for 30 minutes (1800 seconds)
        if (await ipTracker.isBlocked(clientIP)) {
            await ipTracker.blockIP(clientIP, 30 * 60 * 1000); // Block for 30 minutes
            console.warn(`IP blocked for 30 minutes: ${clientIP}`);
            return NextResponse.json({ success: false, message: 'Too many requests. You are blocked for 30 minutes.' }, { status: 429 });
        }

        return NextResponse.json({ success: false, message: rateLimiter['message'] }, { status: 429 });
    }

    // Connect to the database with error handling and timeout
    try {
        await dbConnect();
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }

    try {
        // Get username from query parameters
        const username = req.nextUrl.searchParams.get('username');

        // Validate query parameters with a timeout
        const parsedParams = await Promise.race([
            UsernameQuerySchema.safeParseAsync({ username }),
            timeoutPromise(5000), // 5-second timeout
        ]);

        if (!parsedParams.success) {
            // Record failed attempt if validation fails
            await ipTracker.recordFailedAttempt(clientIP);

            // Log validation failure
            console.warn(`Validation failed for IP: ${clientIP}, Username: ${username}`);

            const usernameErrors = parsedParams.error.format().username?._errors || [];
            const errorMessage =
                usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters';
            return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
        }

        // Reset failed attempts after successful validation
        await ipTracker.resetAttempts(clientIP);

        const { username: validUsername } = parsedParams.data;

        // Check if the username exists with a timeout
        const existingVerifiedUser = await Promise.race([
            UserModel.findOne({ username: validUsername, isVerified: true }),
            timeoutPromise(5000), // 5-second timeout
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

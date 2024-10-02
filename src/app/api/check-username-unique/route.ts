// pages/api/checkUsername.ts

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';
import rateLimit from '@/lib/rateLimiter';
import { NextApiRequest, NextApiResponse } from 'next';

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

// Apply rate limiter (5 requests per minute for demo)
const limiter = rateLimit(5, 60 * 1000);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    // Apply rate limiter
    limiter(req, res, async () => {
        try {
            const { searchParams } = new URL(req.url as string, `http://${req.headers.host}`);
            const queryParams = {
                username: searchParams.get('username'),
            };

            const result = UsernameQuerySchema.safeParse(queryParams);

            if (!result.success) {
                const usernameErrors = result.error.format().username?._errors || [];
                return res.status(400).json({
                    success: false,
                    message:
                        usernameErrors.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
                });
            }

            const { username } = result.data;

            const existingVerifiedUser = await UserModel.findOne({
                username,
                isVerified: true,
            });

            if (existingVerifiedUser) {
                return res.status(200).json({
                    success: false,
                    message: 'Username is already taken',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Username is unique',
            });
        } catch (error) {
            console.error('Error checking username:', error);
            return res.status(500).json({
                success: false,
                message: 'Error checking username',
            });
        }
    });
}

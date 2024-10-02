// lib/rateLimiter.ts

import { NextApiRequest, NextApiResponse } from 'next';

type RateLimitRequest = NextApiRequest & { ip: string };

const rateLimit = (limit: number, interval: number) => {
    const requests = new Map<string, number[]>();

    return (req: RateLimitRequest, res: NextApiResponse, next: () => void) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;

        const now = Date.now();
        const windowStart = now - interval;

        const recentRequests = requests.get(ip as string) || [];

        // Filter out old requests
        const updatedRequests = recentRequests.filter(time => time > windowStart);
        updatedRequests.push(now);

        requests.set(ip as string, updatedRequests);

        if (updatedRequests.length > limit) {
            res.status(429).json({
                success: false,
                message: 'Rate limit exceeded. Try again later.',
            });
            return;
        }

        next();
    };
};

export default rateLimit;

type RateLimitOptions = {
    windowMs: number;
    max: number;
    message: string;
};
const rateLimitStore: Record<string, { count: number; firstRequest: number }> = {};

class RateLimiter {
    private windowMs: number;
    private max: number;
    private message: string;

    constructor(options: RateLimitOptions) {
        this.windowMs = options.windowMs;
        this.max = options.max;
        this.message = options.message;
    }

    async isRateLimited(ip: string): Promise<boolean> {
        const currentTime = Date.now();
        const rateLimitKey = `rate-limit:${ip}`;
        
        // Check if there is an existing record for the IP
        let record = rateLimitStore[rateLimitKey];
        
        if (!record) {
            // No record found, initialize it
            rateLimitStore[rateLimitKey] = { count: 1, firstRequest: currentTime };
            return false;
        }

        let { count, firstRequest } = record;
        count += 1;

        if (currentTime - firstRequest > this.windowMs) {
            // Reset the count and timestamp if the window has passed
            rateLimitStore[rateLimitKey] = { count: 1, firstRequest: currentTime };
            return false;
        }

        if (count > this.max) {
            return true;
        }

        // Update the count
        rateLimitStore[rateLimitKey].count = count;
        return false;
    }
}

const rateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});

export default rateLimiter;

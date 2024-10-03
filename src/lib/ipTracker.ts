import Redis from 'ioredis';

// Initialize Redis (ensure Redis is installed and running)
const redis = new Redis();

type FailedAttempt = {
    attempts: number;
    lastAttempt: number;
    blockDuration: number; // Make blockDuration per-IP
};

class IPTracker {
    private maxAttempts: number;
    private baseBlockDuration: number; // Base block duration in milliseconds

    constructor(maxAttempts: number, baseBlockDuration: number) {
        this.maxAttempts = maxAttempts;
        this.baseBlockDuration = baseBlockDuration;
    }

    async recordFailedAttempt(ip: string): Promise<void> {
        const currentTime = Date.now();
        const attemptData = await redis.get(ip);
        let attempt: FailedAttempt | null = attemptData ? JSON.parse(attemptData) : null;

        if (attempt) {
            // Progressive block: Double the block duration after each block
            if (currentTime - attempt.lastAttempt > attempt.blockDuration) {
                await redis.set(ip, JSON.stringify({
                    attempts: 1,
                    lastAttempt: currentTime,
                    blockDuration: this.baseBlockDuration,
                }));
            } else {
                const newAttempts = attempt.attempts + 1;
                const newBlockDuration = this.baseBlockDuration * Math.pow(2, attempt.attempts - this.maxAttempts);
                await redis.set(ip, JSON.stringify({
                    attempts: newAttempts,
                    lastAttempt: currentTime,
                    blockDuration: newBlockDuration,
                }));
            }
        } else {
            await redis.set(ip, JSON.stringify({
                attempts: 1,
                lastAttempt: currentTime,
                blockDuration: this.baseBlockDuration,
            }));
        }
    }

    async isBlocked(ip: string): Promise<boolean> {
        const attemptData = await redis.get(ip);
        if (!attemptData) return false;

        const attempt: FailedAttempt = JSON.parse(attemptData);
        const currentTime = Date.now();

        if (currentTime - attempt.lastAttempt > attempt.blockDuration) {
            // Reset block if duration has passed
            await redis.del(ip);
            return false;
        }

        return attempt.attempts > this.maxAttempts;
    }

    async resetAttempts(ip: string): Promise<void> {
        await redis.del(ip);
    }
}

const ipTracker = new IPTracker(5, 60 * 1000); // 5 attempts, base block 1 minute

export default ipTracker;

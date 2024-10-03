type FailedAttempt = {
    attempts: number;
    lastAttempt: number;
    blockDuration: number; // Block duration per IP
};

// In-memory store for tracking IP attempts
const ipStore: Record<string, FailedAttempt> = {};

class IPTracker {
    private maxAttempts: number;
    private baseBlockDuration: number; // Base block duration in milliseconds

    constructor(maxAttempts: number, baseBlockDuration: number) {
        this.maxAttempts = maxAttempts;
        this.baseBlockDuration = baseBlockDuration;
    }

    // Record a failed attempt for an IP
    async recordFailedAttempt(ip: string): Promise<void> {
        const currentTime = Date.now();
        const attempt = ipStore[ip] || null;

        if (attempt) {
            // Progressive block: Double block duration after each block
            if (currentTime - attempt.lastAttempt > attempt.blockDuration) {
                ipStore[ip] = {
                    attempts: 1,
                    lastAttempt: currentTime,
                    blockDuration: this.baseBlockDuration,
                };
            } else {
                const newAttempts = attempt.attempts + 1;
                const newBlockDuration = this.baseBlockDuration * Math.pow(2, attempt.attempts - this.maxAttempts);
                ipStore[ip] = {
                    attempts: newAttempts,
                    lastAttempt: currentTime,
                    blockDuration: newBlockDuration,
                };
            }
        } else {
            ipStore[ip] = {
                attempts: 1,
                lastAttempt: currentTime,
                blockDuration: this.baseBlockDuration,
            };
        }
    }

    // Check if an IP is blocked
    async isBlocked(ip: string): Promise<boolean> {
        const attempt = ipStore[ip];
        if (!attempt) return false;

        const currentTime = Date.now();

        if (currentTime - attempt.lastAttempt > attempt.blockDuration) {
            // Reset block if duration has passed
            delete ipStore[ip];
            return false;
        }

        return attempt.attempts > this.maxAttempts;
    }

    // Reset attempts for an IP (unblock IP)
    async resetAttempts(ip: string): Promise<void> {
        delete ipStore[ip];
    }

    // Manually block an IP for a specified duration
    async blockIP(ip: string, duration: number = 30 * 60 * 1000): Promise<void> { // Default block for 30 minutes
        const currentTime = Date.now();
        ipStore[ip] = {
            attempts: this.maxAttempts + 1, // Set attempts to exceed maxAttempts
            lastAttempt: currentTime,
            blockDuration: duration, // Set custom block duration
        };
    }
}

const ipTracker = new IPTracker(5, 60 * 1000); // 5 attempts, base block 1 minute

export default ipTracker;

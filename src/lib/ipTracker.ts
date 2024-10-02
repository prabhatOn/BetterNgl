// lib/ipTracker.ts
type FailedAttempt = {
    attempts: number;
    lastAttempt: number;
};

class IPTracker {
    private failedAttempts: Map<string, FailedAttempt> = new Map();
    private maxAttempts: number;
    private blockDuration: number; // in milliseconds

    constructor(maxAttempts: number, blockDuration: number) {
        this.maxAttempts = maxAttempts;
        this.blockDuration = blockDuration;
    }

    recordFailedAttempt(ip: string): void {
        const currentTime = Date.now();
        const attempt = this.failedAttempts.get(ip);

        if (attempt) {
            if (currentTime - attempt.lastAttempt > this.blockDuration) {
                // Reset if block duration has passed
                this.failedAttempts.set(ip, { attempts: 1, lastAttempt: currentTime });
            } else {
                this.failedAttempts.set(ip, { attempts: attempt.attempts + 1, lastAttempt: currentTime });
            }
        } else {
            this.failedAttempts.set(ip, { attempts: 1, lastAttempt: currentTime });
        }
    }

    isBlocked(ip: string): boolean {
        const attempt = this.failedAttempts.get(ip);
        if (!attempt) return false;

        const currentTime = Date.now();

        if (currentTime - attempt.lastAttempt > this.blockDuration) {
            // Remove the record if block duration has passed
            this.failedAttempts.delete(ip);
            return false;
        }

        return attempt.attempts > this.maxAttempts;
    }

    resetAttempts(ip: string): void {
        this.failedAttempts.delete(ip);
    }
}

const ipTracker = new IPTracker(5, 60 * 1000); // 5 attempts, 1 minute block

export default ipTracker;

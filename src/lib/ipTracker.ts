type FailedAttempt = {
    attempts: number;
    lastAttempt: number;
    blockDuration: number; 
};

const ipStore: Record<string, FailedAttempt> = {};

class IPTracker {
    private maxAttempts: number;
    private baseBlockDuration: number; 

    constructor(maxAttempts: number, baseBlockDuration: number) {
        this.maxAttempts = maxAttempts;
        this.baseBlockDuration = baseBlockDuration;
    }
    async recordFailedAttempt(ip: string): Promise<void> {
        const currentTime = Date.now();
        const attempt = ipStore[ip] || null;

        if (attempt) {
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
    async isBlocked(ip: string): Promise<boolean> {
        const attempt = ipStore[ip];
        if (!attempt) return false;

        const currentTime = Date.now();

        if (currentTime - attempt.lastAttempt > attempt.blockDuration) {
            delete ipStore[ip];
            return false;
        }

        return attempt.attempts > this.maxAttempts;
    }
    async resetAttempts(ip: string): Promise<void> {
        delete ipStore[ip];
    }
    async blockIP(ip: string, duration: number = 30 * 60 * 1000): Promise<void> { 
        const currentTime = Date.now();
        ipStore[ip] = {
            attempts: this.maxAttempts + 1, 
            lastAttempt: currentTime,
            blockDuration: duration, 
        };
    }
}

const ipTracker = new IPTracker(5, 60 * 1000); 

export default ipTracker;

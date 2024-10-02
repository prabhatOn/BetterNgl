// lib/timeout.ts
export const timeoutPromise = (ms: number): Promise<never> =>
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

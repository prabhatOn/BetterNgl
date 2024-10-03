export const timeoutPromise = (ms: number): Promise<never> =>
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

export const fallbackTimeoutPromise = <T>(ms: number, fallback: T): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(fallback), ms));

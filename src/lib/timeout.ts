// Function to reject a promise after a specified timeout with an error message
export const timeoutPromise = (ms: number): Promise<never> =>
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

// Function to resolve a promise with a fallback value after a specified timeout
export const fallbackTimeoutPromise = <T>(ms: number, fallback: T): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(fallback), ms));

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // Disable in dev environment
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Correct placement for eslint config
    },
    // Other Next.js configuration
};

// Apply PWA configuration and export
module.exports = withPWA(nextConfig);

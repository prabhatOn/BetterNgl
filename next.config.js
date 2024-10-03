const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    eslint: {
        ignoreDuringBuilds: true,
    },
});

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint:{
        ignoreDuringBuilds: true,
    }
}
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1kb',  // Limit request body size to 1 KB
        },
    },
};

module.exports = nextConfig

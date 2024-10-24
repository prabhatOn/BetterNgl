const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 365 * 24 * 60 * 60,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
        {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'jsdelivr',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 365 * 24 * 60 * 60,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
        {
            urlPattern: /\/api\/.*$/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-calls',
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 30,
                    maxAgeSeconds: 60 * 60 * 24, 
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
        {
            urlPattern: /.*/i, 
            handler: 'NetworkFirst',
            options: {
                cacheName: 'fallback-cache',
                expiration: {
                    maxEntries: 30,
                    maxAgeSeconds: 60 * 60 * 24, 
                },
            },
        },
    ],
});

const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },

    async headers() {
        return [
            {
                source: '/:all*(js|css|svg|png|jpg|jpeg|gif|webp)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    webpack(config) {
        config.optimization.splitChunks = {
            cacheGroups: {
                framework: {
                    chunks: 'all',
                    name: 'framework',
                    test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
                    priority: 40,
                    enforce: true,
                },
                commons: {
                    name: 'commons',
                    minChunks: 2,
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: -10,
                    name(module) {
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                        )[1];
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        };

        return config;
    },

    compress: true,
    poweredByHeader: false,

    images: {
        domains: ['images.unsplash.com', 'cdn.jsdelivr.net'],
        deviceSizes: [640, 768, 1024, 1280, 1600, 1920],
        formats: ['image/webp'],
        lazyBoundary: '200px', 
    },

    pwa: {
        disable: process.env.NODE_ENV === 'development',
        register: true,
        skipWaiting: true,
        dynamicStartUrl: true,
        fallbacks: {
            image: '/offline-image.png', 
        },
    },
};

module.exports = withPWA(nextConfig);

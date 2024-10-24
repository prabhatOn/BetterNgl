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
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
        {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'unsplash-images',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                },
                cacheableResponse: {
                    statuses: [0, 200],
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
                source: '/:all*(js|css|svg|png|jpg|jpeg|gif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    webpack(config, { isServer }) {
        if (!isServer) {
            config.target = ['web', 'es2017'];
            config.resolve.alias = {
                ...config.resolve.alias,
                'core-js': false,
            };
        }

        config.optimization = {
            ...config.optimization,
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendors: false,
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
                    lib: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                            return match ? `lib.${match[1].replace('@', '')}` : 'lib.unknown'; 
                        },
                        chunks: 'all',
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
    },
};
module.exports = withPWA(nextConfig);

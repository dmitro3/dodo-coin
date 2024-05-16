/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        instrumentationHook: true
    },
    webpack: (config, { isServer }) => {
        config.resolve.fallback = {
            net: false,
            crypto: false,
            fs: false,
            https: false,
            path: false,
            stream: false,
            http: false,
            timers: false,
            querystring: false,
            console: false
        };

        return config;
    },
};

export default nextConfig;

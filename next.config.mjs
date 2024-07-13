/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        instrumentationHook: true
    },
    webpack: (config, options) => {
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
            console: false,
        };
        if (options.dev) {
            // This will run only in development mode
            config.module.rules.push({
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            });
        }
        return config;
    },
    typescript: {
        ignoreBuildErrors: true
    }
};

export default nextConfig;

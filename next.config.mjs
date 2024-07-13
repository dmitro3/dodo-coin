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
            if (options.dev && !options.isServer) {
                const cssRule = config.module.rules.find(
                    (rule) => rule.oneOf && rule.oneOf.find((r) => r.test && r.test.test?.('.css'))
                );

                if (cssRule) {
                    cssRule.oneOf.forEach((rule) => {
                        if (Array.isArray(rule.use)) {
                            rule.use.forEach((use) => {
                                if (use.loader && use.loader.includes('css-loader')) {
                                    use.options = {
                                        ...use.options,
                                        sourceMap: true,
                                    };
                                }
                            });
                        }
                    });
                }
            }
        }
        return config;
    },
    typescript: {
        ignoreBuildErrors: true
    }
};

export default nextConfig;

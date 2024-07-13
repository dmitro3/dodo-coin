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
            Object.defineProperty(config, "devtool", {
                get() {
                    return "source-map";
                },
                set() {},
            });
        }
        config.module= {
            rules: [

                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader' },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName:'[local]'
                            }
                        }
                    ]
                }
            ]
        }
        return config;
    },
    typescript: {
        ignoreBuildErrors: true
    }
};

export default nextConfig;

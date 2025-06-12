/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/admin/login',
                permanent: true,
            }
        ]
    },
    sassOptions: {
        implementation: 'sass-embedded',
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: process.env.NEXT_PUBLIC_IMAGE_HOST,
                port: process.env.NEXT_PUBLIC_IMAGE_PORT,
                pathname: '/**',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_URL_SERVER: process.env.NEXT_PUBLIC_URL_SERVER,
    },
};

export default nextConfig;

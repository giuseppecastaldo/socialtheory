import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    output: "standalone",
    reactStrictMode: false,
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },
};

export default withNextIntl(nextConfig)

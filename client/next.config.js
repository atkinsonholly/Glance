/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
      domains: ["glance.eth.limo"],
    },
    async rewrites() {
        return [
          // Rewrite everything else to use `pages/index`
          {
            source: '/:path*',
            destination: '/',
          },
        ];
      },
  };
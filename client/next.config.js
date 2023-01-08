/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    async rewrites() {
        return [
          // Rewrite everything else to use `pages/index`
          {
            source: '/:path*',
            destination: '/',
          },
        ];
      },
    assetPrefix: './', // IPFS
    trailingSlash: true,
  };
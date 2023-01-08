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
    assetPrefix: 'https://funny-cascaron-71bcc0.netlify.app' || 'http://localhost:3000/',
    trailingSlash: true,
  };
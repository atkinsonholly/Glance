/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: "*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "https://funny-cascaron-71bcc0.netlify.app/" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          ]
        }
      ]
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
    // assetPrefix: 'http://localhost:3000/',
    // trailingSlash: true,
  };
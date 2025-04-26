/** @type {import('next').NextConfig} */

const nextConfig = {
    async headers() {
        return [
          {
            source: '/api/:path*',
            headers: [
              {
                key: 'Access-Control-Allow-Origin',
                value: process.env.BASE_URL,
              },
              {
                key: 'Access-Control-Allow-Methods',
                value: 'GET, POST',
              },
              {
                key: 'Access-Control-Allow-Headers',
                value: 'Content-Type, Authorization',
              },
            ],
          },
        ];
      },
};

export default nextConfig;

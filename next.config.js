/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/polymarket/:path*',
        destination: 'https://gamma-api.polymarket.com/:path*',
      },
    ]
  },
}

export default nextConfig

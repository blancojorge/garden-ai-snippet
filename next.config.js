/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['media.cdn.bauhaus'],
  },
  env: {
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  },
  // GitHub Pages specific configuration
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/garden-ai-snippet' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/garden-ai-snippet/' : '',
}

module.exports = nextConfig 
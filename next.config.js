/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  },
}

module.exports = nextConfig 
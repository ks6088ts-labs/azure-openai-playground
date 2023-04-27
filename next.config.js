/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
  },
}

module.exports = nextConfig

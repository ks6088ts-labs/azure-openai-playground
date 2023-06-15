/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_NAME: process.env.AZURE_OPENAI_NAME,
    AZURE_OPENAI_DEPLOYMENT_NAME: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    AZURE_OPENAI_API_VERSION: process.env.AZURE_OPENAI_API_VERSION,
    AZURE_OPENAI_SITE_BRANDING: process.env.AZURE_OPENAI_SITE_BRANDING,
    AZURE_OPENAI_API_URL: process.env.AZURE_OPENAI_API_URL,
    AZURE_OPENAI_API_STREAM_ENABLED: process.env.AZURE_OPENAI_API_STREAM_ENABLED,
  },
}

module.exports = nextConfig

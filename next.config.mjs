/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "telegramchannels.me",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "bourter-bucket.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.telegram.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

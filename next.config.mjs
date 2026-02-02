/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "telegramchannels.me",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;

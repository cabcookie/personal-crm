/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.eu-west-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net:false };

    return config;
  }
};

export default nextConfig;

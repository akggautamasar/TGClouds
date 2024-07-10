/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      return config;
    }

    config.resolve.fallback = { fs: false, net: false, async_hooks: false };
    return config;
  },
};

export default nextConfig;

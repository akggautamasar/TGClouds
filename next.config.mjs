import { withSentryConfig } from "@sentry/nextjs";
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
      {
        hostname: "api.dicebear.com",
        protocol: "https",
        port: "",
      },
    ],
  },
  compiler: {
    removeConsole: {
      exclude: ["error", "warn"],
    },
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      return config;
    }

    config.resolve.fallback = { fs: false, net: false, async_hooks: false };
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: "kumneger-cg",
  project: "tg-cloud",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  hideSourceMaps: true,

  disableLogger: true,

  automaticVercelMonitors: true,
});

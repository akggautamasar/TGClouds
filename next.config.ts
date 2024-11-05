import { withSentryConfig } from '@sentry/nextjs';
import { NextConfig } from 'next';
const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
				port: ''
			},
			{
				protocol: 'https',
				hostname: 'img.freepik.com',
				port: ''
			},
			{
				hostname: 'api.dicebear.com',
				protocol: 'https',
				port: ''
			}
		]
	},

	experimental: {
		after: true,
		turbo: {
			resolveAlias: {
				'~fluid-player/src/css/fluidplayer.css': 'node_modules/fluid-player/src/css/fluidplayer.css'
			}
		}
	},
	webpack: (config, { isServer }) => {
		if (isServer) {
			return config;
		}

		config.resolve.fallback = { fs: false, net: false, async_hooks: false };
		return config;
	}
};

export default withSentryConfig(nextConfig, {
	org: 'kumneger-cg',
	project: 'tg-cloud',
	silent: !process.env.CI,
	widenClientFileUpload: true,
	hideSourceMaps: true,
	disableLogger: true,
	automaticVercelMonitors: true
});

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'TGCloud',
		short_name: 'TGCloud',
		description:
			'Enjoy unlimited cloud storage integrated with Telegram. Effortlessly store and manage your files with no limits.',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/TGCloud_PWA_icon_192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/TGCloud_PWA_icon_512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		]
	};
}

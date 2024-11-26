import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../patch-global-alert-polyfill';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { env } from '@/env';

const inter = Inter({ subsets: ['latin'] });

import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';

import Providers, { TGCloudGlobalContextWrapper, CSPostHogProvider } from '@/lib/context';

export const metadata: Metadata = {
	metadataBase: new URL('https://yourtgcloud.vercel.app/'),
	title: 'Unlimited Cloud Storage | TGCloud',

	description:
		'Enjoy unlimited cloud storage integrated with Telegram. Effortlessly store and manage your files with no limits.',
	keywords: 'unlimited cloud storage, Telegram integration, file management, cloud storage app',
	openGraph: {
		title: 'Unlimited Cloud Storage | TGCloud',
		description:
			'Enjoy unlimited cloud storage integrated with Telegram. Effortlessly store and manage your files with no limits.',
		images: [
			{
				url: '/TGCloud.webp',
				alt: 'Unlimited Cloud Storage',
				width: 1200,
				height: 630
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Unlimited Cloud Storage | Your Cloud App',
		description:
			'Enjoy unlimited cloud storage integrated with Telegram. Effortlessly store and manage your files with no limits.',
		images: [
			{
				url: '/TGCloud.webp'
			}
		]
	}
};

// export default async function RootLayout({
// 	children
// }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	const telegramSession = (await cookies()).get('telegramSession');
// 	return (
// 		<html lang="en">
// 			<link rel="icon" href="/favicon.ico" sizes="any" />
// 			<CSPostHogProvider>
// 				<body className={inter.className}>
// 					<Providers>
// 						<ThemeProvider
// 							attribute="class"
// 							defaultTheme="system"
// 							enableSystem
// 							disableTransitionOnChange
// 						>
// 							<TGCloudGlobalContextWrapper telegramSession={telegramSession?.value}>
// 								{children}
// 							</TGCloudGlobalContextWrapper>
// 						</ThemeProvider>
// 					</Providers>
// 					<Toaster />
// 				</body>
// 			</CSPostHogProvider>
// 		</html>
// 	);
// }


export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const telegramSession = (await cookies()).get('telegramSession');
	return (
		<html lang="en">
			<link rel="icon" href="/favicon.ico" sizes="any" />
			<CSPostHogProvider>
				<body className={inter.className}>
					<main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
						<h1 className="text-6xl font-bold tracking-wide">Site temporarily unavailable</h1>
						<p className="mt-4 text-lg">
							We are currently performing some maintenance tasks. We will be back soon.
						</p>
					</main>
					<Toaster />
				</body>
			</CSPostHogProvider>
		</html>
	);
}
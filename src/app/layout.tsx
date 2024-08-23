import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../../patch-global-alert-polyfill';

import { ThemeProvider } from '@/components/theme-provider';
import { env } from '@/env';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

import { Toaster } from 'react-hot-toast';

import Providers, { SortByContext, SortByContextWrapper } from '@/lib/context';

export const metadata: Metadata = {
	metadataBase: new URL('https://tgcloud-k.vercel.app/'),
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
				url: '/path-to-your-logo.png',
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
		images: [{ url: '/path-to-your-logo.png' }]
	}
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<ClerkProvider
						afterSignOutUrl={'/login'}
						publishableKey={env.NEXT_PUBLIC_PUBLISHABLE_KEY}
						signUpForceRedirectUrl={'/connect-telegram'}
						signInForceRedirectUrl={'/connect-telegram'}
					>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<SortByContextWrapper>{children}</SortByContextWrapper>
						</ThemeProvider>
					</ClerkProvider>
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}

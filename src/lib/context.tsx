'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import React, { Dispatch, SetStateAction, useState, useEffect, useTransition } from 'react';
import { env } from '../env';
import { TelegramClient } from 'telegram';
import { getTgClient } from './getTgClient';

if (typeof window !== 'undefined') {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
		person_profiles: 'always'
	});
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<ProgressBar height="4px" color="#c21333" options={{ showSpinner: true }} shallowRouting />
		</>
	);
};

export default Providers;

type SortBy = 'name' | 'size' | 'type' | 'date';
type connectionState = 'connected' | 'disconnected' | 'connecting' | 'reconnecting';

export const TGCloudGlobalContext = React.createContext<
	| {
			sortBy: SortBy;
			setSortBy: Dispatch<SetStateAction<SortBy>>;
			connectionStatus: connectionState;
			setConnectionStatus: Dispatch<SetStateAction<connectionState>>;
			shouldShowUploadModal: boolean;
			setShouldShowUploadModal: Dispatch<SetStateAction<boolean>>;
			telegramClient: TelegramClient | null;
			isSwitchingFolder: boolean;
			startPathSwitching: React.TransitionStartFunction;
			getClient: () => TelegramClient | null;
			isClientLoading: boolean;
			botRateLimit: {
				isRateLimited: boolean;
				retryAfter: number;
			};
	  }
	| undefined
>(undefined);

export const TGCloudGlobalContextWrapper = ({ children }: { children: React.ReactNode }) => {
	const [sortBy, setSortBy] = useState<SortBy>('name');
	const [connectionStatus, setConnectionStatus] = useState<connectionState>('disconnected');
	const [shouldShowUploadModal, setShouldShowUploadModal] = useState<boolean>(false);
	const [client, setClient] = useState<TelegramClient | null>(null);
	const [isSwitchingFolder, startPathSwitching] = useTransition();
	const [isClientLoading, setIsClientLoading] = useState(true);
	const [botRateLimit, setBotRateLimit] = useState<{
		isRateLimited: boolean;
		retryAfter: number;
	}>({
		isRateLimited: false,
		retryAfter: 0
	});

	useEffect(() => {
		async function initClient() {
			try {
				setIsClientLoading(true);
				const newClient = await getTgClient({ setBotRateLimit });
				setClient(newClient || null);
				setIsClientLoading(false);
			} catch (error) {
				console.error('Failed to initialize Telegram client:', error);
				setIsClientLoading(false);
			}
		}

		initClient();

		return () => {
			if (client) {
				client.disconnect().catch(console.error);
			}
		};
	}, []);

	return (
		<TGCloudGlobalContext.Provider
			value={{
				setSortBy,
				sortBy,
				connectionStatus,
				setConnectionStatus,
				shouldShowUploadModal,
				setShouldShowUploadModal,
				telegramClient: client,
				isSwitchingFolder,
				startPathSwitching,
				getClient: () => client,
				isClientLoading,
				botRateLimit
			}}
		>
			{children}
		</TGCloudGlobalContext.Provider>
	);
};

export const getGlobalTGCloudContext = () => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	return React.use(TGCloudGlobalContext);
};

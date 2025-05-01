'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import React, { Dispatch, SetStateAction, useState, useTransition } from 'react';
import { env } from '../env';

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
			isSwitchingFolder: boolean;
			startPathSwitching: React.TransitionStartFunction;
			botRateLimit: {
				isRateLimited: boolean;
				retryAfter: number;
			};
			setBotRateLimit: React.Dispatch<
				React.SetStateAction<{
					isRateLimited: boolean;
					retryAfter: number;
				}>
			>;
	  }
	| undefined
>(undefined);

export const TGCloudGlobalContextWrapper = ({ children }: { children: React.ReactNode }) => {
	const [sortBy, setSortBy] = useState<SortBy>('name');
	const [connectionStatus, setConnectionStatus] = useState<connectionState>('disconnected');
	const [shouldShowUploadModal, setShouldShowUploadModal] = useState<boolean>(false);
	const [isSwitchingFolder, startPathSwitching] = useTransition();
	const [botRateLimit, setBotRateLimit] = useState<{
		isRateLimited: boolean;
		retryAfter: number;
	}>({
		isRateLimited: false,
		retryAfter: 0
	});

	return (
		<TGCloudGlobalContext.Provider
			value={{
				setSortBy,
				sortBy,
				connectionStatus,
				setConnectionStatus,
				shouldShowUploadModal,
				setShouldShowUploadModal,
				isSwitchingFolder,
				startPathSwitching,
				botRateLimit,
				setBotRateLimit
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

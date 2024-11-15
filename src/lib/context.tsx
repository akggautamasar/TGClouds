'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import React, { Dispatch, SetStateAction, use, useState } from 'react';
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
			telegramSession: string | undefined;
			connectionStatus: connectionState;
			setConnectionStatus: Dispatch<SetStateAction<connectionState>>;
	  }
	| undefined
>(undefined);

export const TGCloudGlobalContextWrapper = ({
	children,
	telegramSession
}: {
	children: React.ReactNode;
	telegramSession: string | undefined;
}) => {
	const [sortBy, setSortBy] = useState<SortBy>('name');
	const [connectionStatus, setConnectionStatus] = useState<connectionState>('disconnected');
	return (
		<TGCloudGlobalContext.Provider
			value={{
				setSortBy,
				sortBy,
				telegramSession,
				connectionStatus,
				setConnectionStatus
			}}
		>
			{children}
		</TGCloudGlobalContext.Provider>
	);
};

export const getGlobalTGCloudContext = () => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	return use(TGCloudGlobalContext);
};

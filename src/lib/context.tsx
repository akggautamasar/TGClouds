'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { use } from 'react';

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

export const TGCloudGlobalContext = React.createContext<
	| {
			sortBy: SortBy;
			setSortBy: Dispatch<SetStateAction<SortBy>>;
			telegramSession: string | undefined;
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

	return (
		<TGCloudGlobalContext.Provider value={{ setSortBy, sortBy, telegramSession }}>
			{children}
		</TGCloudGlobalContext.Provider>
	);
};

export const useTGCloudGlobalContext = () => {
	return use(TGCloudGlobalContext);
};
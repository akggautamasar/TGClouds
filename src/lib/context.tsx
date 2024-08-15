'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { TelegramClient } from 'telegram';
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

export const SortByContext = React.createContext<
	| {
			sortBy: SortBy;
			setSortBy: Dispatch<SetStateAction<SortBy>>;
	  }
	| undefined
>(undefined);

export const SortByContextWrapper = ({ children }: { children: React.ReactNode }) => {
	const [sortBy, setSortBy] = useState<SortBy>('name');

	return <SortByContext.Provider value={{ setSortBy, sortBy }}>{children}</SortByContext.Provider>;
};

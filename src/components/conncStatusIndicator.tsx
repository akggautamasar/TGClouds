'use client';
import { getGlobalTGCloudContext } from '@/lib/context';
import React from 'react';

export default function ConnectionStatusIndicator() {
	const TGCloudGlobalContext = getGlobalTGCloudContext();

	return (
		<div className="mt-2">
			<span className="text-sm font-semibold">
				Telegram Status:{' '}
				<span
					className={
						TGCloudGlobalContext?.connectionStatus === 'connected'
							? 'text-green-600'
							: 'text-red-600'
					}
				>
					{TGCloudGlobalContext?.connectionStatus}
				</span>
			</span>
		</div>
	);
}

'use client';

if (typeof window !== 'undefined') {
	window.alert = (message: any) => {
		console.warn(message);
	};
}

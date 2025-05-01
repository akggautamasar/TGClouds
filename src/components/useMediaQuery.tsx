'use client';
import { useEffect, useState } from 'react';
export function useMediaQuery(mediaQuery: string) {
	const [matches, setMatches] = useState<boolean>(false);

	useEffect(() => {
		if (!window) return;

		const mediaQueryList = window.matchMedia(mediaQuery);

		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		handleChange(mediaQueryList as unknown as MediaQueryListEvent);

		mediaQueryList.addEventListener('change', handleChange);

		return () => {
			mediaQueryList.removeEventListener('change', handleChange);
		};
	}, [mediaQuery]);

	return matches;
}

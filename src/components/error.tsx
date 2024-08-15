import Link from 'next/link';

export function Error() {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-white">
			<div className="animate-bounce">
				<svg
					className="w-16 h-16 text-red-500"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 8V16M12 20V22M12 4V2M4 12H2M22 12H20M18.3639 18.3639L16.95 16.95M7.05 7.05L5.6361 5.6361M18.3639 5.6361L16.95 7.05M7.05 16.95L5.6361 18.3639"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
			<div className="mt-4 text-2xl font-bold text-red-500">Oops, something went wrong!</div>
			<div className="mt-2 text-red-500">Please try again later.</div>
			<Link
				href="/"
				className="mt-6 inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-red-500 shadow-sm transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
				prefetch={false}
			>
				Go to Homepage
			</Link>
		</div>
	);
}

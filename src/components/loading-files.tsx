import { Skeleton } from '@/components/ui/skeleton';

export function LoadingFiles() {
	return (
		<div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[240px_1fr] bg-background">
			<div className="hidden md:flex flex-col border-r bg-muted/40 px-4 py-6">
				<Skeleton className="h-6 w-32" />
				<nav className="mt-8 flex flex-col gap-4">
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
				</nav>
				<div className="mt-auto flex items-center gap-2">
					<Skeleton className="h-8 w-8 rounded-full" />
					<div className="grid gap-0.5">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</div>
			<div className="flex  w-full flex-col">
				<header className="sticky top-0 z-30 hidden md:flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
					<div className="relative flex-1">
						<Skeleton className="h-8 w-full rounded-lg" />
					</div>
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-8 w-24 rounded-lg" />
				</header>
				<LoadingItems />
			</div>
		</div>
	);
}

export function LoadingItems() {
	return (
		<main className="flex-1 overflow-auto p-6">
			<div className="grid  w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
				{new Array(8).fill(0).map((item, index) => (
					<Skeleton key={index} className="h-64 w-full md:w-auto rounded-lg" />
				))}
			</div>
		</main>
	);
}

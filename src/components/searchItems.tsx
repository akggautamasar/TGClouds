'use client';
import { useCreateQueryString } from '@/lib/utils';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from './ui/input';

function SearchItems() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const createQueryString = useCreateQueryString(searchParams);

	const debounced = useDebouncedCallback((value: string) => {
		router.push(pathname + '?' + createQueryString('search', value));
	}, 200);

	return (
		<div className="w-full flex-1">
			<form>
				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search items..."
						className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
						onChange={(e) => debounced(e.target.value)}
					/>
				</div>
			</form>
		</div>
	);
}

export default SearchItems;

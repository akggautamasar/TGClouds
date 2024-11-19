'use client';
import { Suspense, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FolderNavigationBar from './folder-navigation-bar';
import { Button } from '@/components/ui/button';
import { Folder, ChevronDown, ChevronUp } from 'lucide-react';
import { FileItem, Folder as FolderType } from '@/lib/types';
import { createFolder, getFolderHierarchy } from '@/actions';
import { useOptimistic } from 'react';
import { useCreateQueryString } from '@/lib/utils';
import Link from 'next/link';
import {revalidateTag} from 'next/cache'

export type AllFolder = {
	id: string;
	name: string;
	userId: string;
	parentId: string | null;
	path: string;
	createdAt: string | null;
	updatedAt: string | null;
}[];

interface StoragePageProps {
	folders: FolderType[];
	currentFolderId: string | null;
	userId: string;
	foldersHierarchy: Awaited<ReturnType<typeof getFolderHierarchy>>;
	allFolder: AllFolder;
}

export default function StoragePage({
	folders,
	userId,
	foldersHierarchy,
	currentFolderId,
	allFolder
}: StoragePageProps) {
	const [isFoldersVisible, setIsFoldersVisible] = useState(true);
	const [foldersOptimistic, setFoldersOptimistic] = useOptimistic<FolderType[]>(folders);
	const searchParams = useSearchParams();
	const createQueryString = useCreateQueryString(searchParams);
	const pathname = usePathname();
	const router = useRouter();

	const handleNavigate = (folderId: string | null) => {
		if (folderId) {
			router.push(`${pathname}?folderId=${folderId}`);
		} else {
			router.push(`${pathname}`);
		}
	};

	const handleCreateFolder = async (folderName: string) => {
		try {
			setFoldersOptimistic((foldersOptimistic) => [
				...foldersOptimistic,
				{
					id: crypto.randomUUID(),
					name: folderName,
					path: '',
					parentId: currentFolderId,
					userId: userId,
					createdAt: new Date().toDateString(),
					updatedAt: new Date().toDateString()
				} satisfies FolderType
			]);
			await createFolder(folderName, currentFolderId);
			revalidateTag('get-folder');
			router.refresh();
		} catch (error) {
			console.error('Error creating folder:', error);
		}
	};


   console.log(allFolder);


	return (
		<div className="container mx-auto p-4">
			<FolderNavigationBar
				allFolder={allFolder}
				folders={foldersHierarchy}
				currentFolderId={currentFolderId}
				onNavigate={handleNavigate}
				onCreateFolder={handleCreateFolder}
				userId={userId}
			/>
			<div className="mt-4">
				<Button
					variant="ghost"
					className="mb-2 w-full flex items-center justify-between"
					onClick={() => setIsFoldersVisible(!isFoldersVisible)}
				>
					<span>Folders</span>
					{isFoldersVisible ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</Button>
				<div
					className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-300 ${
						isFoldersVisible ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
					}`}
				>
					{foldersOptimistic.map((folder) => {
						const path = `${pathname}?${createQueryString('folderId', folder?.id as string)}`;
						return (
							<Button
								key={folder?.id}
								variant="outline"
								className="flex items-center justify-start h-12"
								onMouseEnter={() => router.prefetch(path)}
							>
								<Folder className="h-4 w-4 mr-2" />
								<Link href={path} className="text-inherit">
									{folder?.name}
								</Link>
							</Button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

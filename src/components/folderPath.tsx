'use client';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import FolderNavigationBar from './folder-navigation-bar';
import { Button } from '@/components/ui/button';
import { Folder, ChevronDown, ChevronUp } from 'lucide-react';
import { FileItem, Folder as FolderType } from '@/lib/types';
import { createFolder, getFolderHierarchy } from '@/actions';

interface StoragePageProps {
	folders: FolderType[];
	currentFolderId: string | null;
	userId: string;
	foldersHierarchy: Awaited<ReturnType<typeof getFolderHierarchy>>;
}

export default function StoragePage({
	folders,
	userId,
	foldersHierarchy,
	currentFolderId
}: StoragePageProps) {
	const [isFoldersVisible, setIsFoldersVisible] = useState(true);
	const router = useRouter();

	const handleNavigate = (folderId: string | null) => {
		if (folderId) {
			router.push(`/files?folderId=${folderId}`);
		} else {
			router.push('/files');
		}
	};

	const handleCreateFolder = async (folderName: string) => {
		try {
			await createFolder(folderName, currentFolderId);
			router.refresh();
		} catch (error) {
			console.error('Error creating folder:', error);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<FolderNavigationBar
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
					{folders.map((folder) => (
						<Button
							key={folder?.id}
							variant="outline"
							className="flex items-center justify-start h-12"
							onClick={() => handleNavigate(folder?.id as string)}
						>
							<Folder className="h-4 w-4 mr-2" />
							{folder?.name}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}

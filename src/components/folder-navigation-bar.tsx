import { getFolderHierarchy } from '@/actions';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronRight, Home, Plus } from 'lucide-react';
import { use, useState } from 'react';

interface FolderNavigationBarProps {
	currentPath?: string[];
	onNavigate: (path: string) => void;
	onCreateFolder: (folderName: string) => void;
	currentFolderId: string | null;
	userId: string;
	folders: Awaited<ReturnType<typeof getFolderHierarchy>>;
}

export default function FolderNavigationBar({
	onNavigate,
	onCreateFolder,
	currentFolderId,
	userId,
	folders
}: FolderNavigationBarProps) {
	const [newFolderName, setNewFolderName] = useState('');

	const handleCreateFolder = () => {
		if (newFolderName.trim()) {
			onCreateFolder(newFolderName.trim());
			setNewFolderName('');
		}
	};

	return (
		<div className="	flex items-center justify-between p-2 bg-zinc-800 rounded-md">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink onClick={() => onNavigate('')}>
							<Home className="h-4 w-4" />
						</BreadcrumbLink>
					</BreadcrumbItem>
					{folders.length > 0 && (
						<BreadcrumbSeparator>
							<ChevronRight className="h-4 w-4" />
						</BreadcrumbSeparator>
					)}
					{folders.map((folder, index) => (
						<BreadcrumbItem key={index}>
							<BreadcrumbLink onClick={() => onNavigate(folder?.id as string)}>
								{folder?.name}
							</BreadcrumbLink>
							{index < folders.length - 1 && (
								<BreadcrumbSeparator>
									<ChevronRight className="h-4 w-4" />
								</BreadcrumbSeparator>
							)}
						</BreadcrumbItem>
					))}
				</BreadcrumbList>
			</Breadcrumb>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="icon">
						<Plus className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="flex flex-col space-y-2">
						<h3 className="font-medium">Create New Folder</h3>
						<div className="flex space-x-2">
							<Input
								placeholder="Folder name"
								value={newFolderName}
								onChange={(e) => setNewFolderName(e.target.value)}
							/>
							<Button onClick={handleCreateFolder}>Create</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

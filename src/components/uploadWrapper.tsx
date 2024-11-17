'use client';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useState } from 'react';
import { UploadIcon } from './Icons/icons';
import { UploadFiles } from './upload-files';
import { User } from '@/lib/types';
import TGCloudPricing from './TGCloudPricing';
import { getGlobalTGCloudContext } from '@/lib/context';

export default function DrawerDialogDemo({ user }: { user: User }) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const TGCloudGlobalContext = getGlobalTGCloudContext();
	const telegramSession = TGCloudGlobalContext?.telegramSession;

	if (!TGCloudGlobalContext?.shouldShowUploadModal) return null;
	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<DialogTrigger>
						<div className="flex justify-center items-center gap-2">
							<UploadIcon className="h-4 w-4" />
							Upload
						</div>
					</DialogTrigger>
				</DialogTrigger>
				<DialogContent className="w-[700px]">
					<DialogTitle className="sr-only">upload file</DialogTitle>
					{/* {user?.isSubscribedToPro ? ( */}
					<UploadFiles telegramSession={telegramSession} setOpen={setOpen} user={user} />
					{/* ) : ( */}
					{/* <TGCloudPricing /> */}
					{/* )} */}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<DialogTrigger>
					{' '}
					<div className="flex justify-center items-center gap-2">
						<UploadIcon className="h-4 w-4" />
						Upload
					</div>
				</DialogTrigger>
			</DrawerTrigger>
			<DrawerContent className="h-4/5">
				{/* {user?.isSubscribedToPro ? ( */}
				<UploadFiles telegramSession={telegramSession} setOpen={setOpen} user={user} />
				{/* ) : ( */}
				{/* <TGCloudPricing /> */}
				{/* )} */}
			</DrawerContent>
		</Drawer>
	);
}

'use client';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { User } from '@/lib/types';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useState } from 'react';
import TGCloudPricing from './farmui/TGCloudPricing';

export default function Pricing({ user, children }: { user: User; children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 900px)');

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<DialogTrigger>{children}</DialogTrigger>
				</DialogTrigger>
				<DialogContent>
					<TGCloudPricing />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<DialogTrigger>{children}</DialogTrigger>
			</DrawerTrigger>
			<DrawerContent>
				<TGCloudPricing />
			</DrawerContent>
		</Drawer>
	);
}

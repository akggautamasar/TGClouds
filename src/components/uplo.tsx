'use client';

import dynamic from 'next/dynamic';
import { User } from '@/lib/types';
const Upload = dynamic(
	() => import('./uploadWrapper'),
	{ ssr: false }
);
export default function UploadFile({ user }: { user: User }) {
	return <Upload user={user} />;
}

import { getAllFiles, requireUserAuthentication } from '@/actions';
import { Dashboard } from '@/components/dashboard';
import Files from '@/components/FilesRender';
import { LoadingItems } from '@/components/loading-files';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const generateMetadata = async (): Promise<Metadata> => {
	return {
		title: 'Files'
	};
};

export default async function Home(props: { searchParams: Promise<Record<string, string>> }) {
	const searchParams = await props.searchParams;
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const user = await requireUserAuthentication();

	const searchItem = searchParams.search;

	const page = parseInt(searchParams.page || '1');

	//@ts-ignore
	const [files, total] = await getAllFiles(searchItem, (page - 1) * 8);

	return (
		<Dashboard total={total} user={user}>
			<Suspense fallback={<LoadingItems />}>
				<Files files={files} user={user} />
			</Suspense>
		</Dashboard>
	);
}

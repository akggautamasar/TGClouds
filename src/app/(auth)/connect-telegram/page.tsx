import { getUser } from '@/actions';
import ConnectTelegram from '@/components/connectTelegram';
import { User } from '@/lib/types';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function Page() {
	const userClerk = await currentUser();
	if (!userClerk) return redirect('/login');
	const user = await getUser();
	const telegramSession = (await cookies()).get('telegramSession');

	if (
		user?.hasPublicTgChannel !== null &&
		user?.hasPublicTgChannel !== undefined &&
		user.accessHash &&
		user.channelId &&
		telegramSession
	)
		return redirect('/files');

	return (
		<div>
			<ConnectTelegram user={user as NonNullable<User>} />
		</div>
	);
}

export default Page;

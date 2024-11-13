import { getUser } from '@/actions';
import ConnectTelegram from '@/components/connectTelegram';
import { User } from '@/lib/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function Page() {
	const user = await getUser();
	if (!user) {
		redirect('/login');
	}

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

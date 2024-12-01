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
	return (
		<div>
			<ConnectTelegram user={user as NonNullable<User>} />
		</div>
	);
}

export default Page;

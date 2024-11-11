import { env } from '@/env';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export function getTgClient(telegramSession: string) {
	const session = new StringSession(telegramSession);
	const client = new TelegramClient(
		session,
		env.NEXT_PUBLIC_TELEGRAM_API_ID,
		env.NEXT_PUBLIC_TELEGRAM_API_HASH,
		{
			connectionRetries: 5,
			useWSS: true
		}
	);
	return client;
}

// export const getBotClient = async () => {
// 	const session = sessionStorage.getItem('bot-session') ?? '';
// 	const client = new TelegramClient(
// 		new StringSession(session),
// 		env.NEXT_PUBLIC_TELEGRAM_API_ID,
// 		env.NEXT_PUBLIC_TELEGRAM_API_HASH,
// 		{ connectionRetries: 5 }
// 	);

// 	if (session) return client;
// 	await client.start({
// 		botAuthToken: env.NEXT_PUBLIC_BOT_TOKEN
// 	});
// 	const botSession = client.session.save() as unknown as string;
// 	sessionStorage.setItem('bot-session', botSession);
// 	return client;
// };

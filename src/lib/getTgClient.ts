'use client';
import { getUser } from '@/actions';
import { env } from '@/env';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export interface GetTgClientOptions {
	stringSession?: string;
	botToken?: string;
	setBotRateLimit?: React.Dispatch<React.SetStateAction<{
		isRateLimited: boolean;
		retryAfter: number;
	}>>;
}
export async function getTgClient({ stringSession, botToken, setBotRateLimit }: GetTgClientOptions = {}) {
	console.log('getTgClient called');
	if (typeof window === 'undefined') return;
	const user = await getUser();
	if (!user) return;

	console.log('botToken', botToken);

	const token = botToken ?? user.botToken ?? env.NEXT_PUBLIC_BOT_TOKEN
	try {
		console.log('about to create TelegramClient');
		const client = new TelegramClient(
			new StringSession(stringSession),
			env.NEXT_PUBLIC_TELEGRAM_API_ID,
			env.NEXT_PUBLIC_TELEGRAM_API_HASH,
			{ connectionRetries: 5 }
		);
		console.log('about to start TelegramClient');
		try {
			await client.start({
				botAuthToken: token
			});
		} catch (startError: any) {
			console.error('Error starting TelegramClient:', startError.code);
			if (startError?.message?.includes('A wait of')) {
				const waitTimeMatch = startError.message.match(/(\d+)\sseconds/);
				if (waitTimeMatch) {
					const waitTime = parseInt(waitTimeMatch[1]);
					const timeInMilliseconds = waitTime * 1000;
					setBotRateLimit?.({
						isRateLimited: true,
						retryAfter: waitTime
					});

					await new Promise((resolve) => setTimeout(resolve, timeInMilliseconds));
					await client.start({
						botAuthToken: token
					});
				}
				console.log('session', client.session.save());
			} else {
				throw startError;
			}
		}

		return client;
	} catch (error) {
		console.error('Error initializing Telegram   client:', error);
		return undefined;
	}
}

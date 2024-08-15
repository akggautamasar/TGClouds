import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import { env } from '@/env';
import React from 'react';

const stringSession = '';
const BOT_USERNAME = 'TGCLoudShareFileBot';
const BOT_TOKEN = '6995045431:AAGGAb8yc_22q2yPRzBLhS_TE0NEC-B64y4';

export function getTgClient(telegramSession: string) {
	const session = new StringSession(telegramSession);
	const client = new TelegramClient(
		session,
		env.NEXT_PUBLIC_TELEGRAM_API_ID,
		env.NEXT_PUBLIC_TELEGRAM_API_HASH,
		{
			connectionRetries: 5
		}
	);
	return client;
}

export const getBotClient = async () => {
	const session = sessionStorage.getItem('bot-session') ?? '';
	const client = new TelegramClient(
		new StringSession(session),
		env.NEXT_PUBLIC_TELEGRAM_API_ID,
		env.NEXT_PUBLIC_TELEGRAM_API_HASH,
		{ connectionRetries: 5 }
	);

	if (session) return client;
	await client.start({
		botAuthToken: BOT_TOKEN
	});
	const botSession = client.session.save() as unknown as string;
	sessionStorage.setItem('bot-session', botSession);
	return client;
};

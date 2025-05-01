'use client';
import { getUser, updateTokenRateLimit } from '@/actions';
import { env } from '@/env';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export interface GetTgClientOptions {
	stringSession?: string;
	botToken?: string;
	setBotRateLimit?: React.Dispatch<
		React.SetStateAction<{
			isRateLimited: boolean;
			retryAfter: number;
		}>
	>;
}
const getBotTokenWithLeastAmountOfRemaingRateLimit = async (
	user: Awaited<ReturnType<typeof getUser>>
) => {
	const allTokens = user?.botTokens ?? [];

	const isThereAnyBotWithoutRateLimit = allTokens.some((token) => !token.rateLimitedUntil);
	if (isThereAnyBotWithoutRateLimit) {
		return allTokens.find((token) => !token.rateLimitedUntil)?.token;
	}
	const now = new Date().getTime() / 1000;
	const tokenWithLeastAmountOfRemainingRateLimit = (
		allTokens.filter((token) => token.rateLimitedUntil) as unknown as {
			rateLimitedUntil: Date;
			token: string;
			id: string;
		}[]
	).sort((a, b) => {
		const remainingA = a.rateLimitedUntil?.getTime() / 1000 - now;
		const remainingB = b.rateLimitedUntil?.getTime() / 1000 - now;
		return remainingA - remainingB;
	})[0];

	return tokenWithLeastAmountOfRemainingRateLimit?.token;
};

export async function getTgClient({
	stringSession,
	botToken,
	setBotRateLimit
}: GetTgClientOptions = {}) {
	if (typeof window === 'undefined') return;
	const user = await getUser();
	if (!user) return;
	const userBotToken = await getBotTokenWithLeastAmountOfRemaingRateLimit(user);
	const token = botToken ?? userBotToken ?? env.NEXT_PUBLIC_BOT_TOKEN;

	try {
		localStorage.removeItem('GramJs:apiCache');
		const client = new TelegramClient(
			new StringSession(stringSession),
			env.NEXT_PUBLIC_TELEGRAM_API_ID,
			env.NEXT_PUBLIC_TELEGRAM_API_HASH,
			{ connectionRetries: 5 }
		);

		try {
			await client.start({
				botAuthToken: token
			});
		} catch (startError: any) {
			if (startError?.message?.includes('A wait of')) {
				const waitTimeMatch = startError.message.match(/(\d+)\sseconds/);
				if (waitTimeMatch) {
					const waitTime = parseInt(waitTimeMatch[1]);
					const timeInMilliseconds = waitTime * 1000;
					setBotRateLimit?.({
						isRateLimited: true,
						retryAfter: waitTime
					});
					const tokenId = user?.botTokens?.find((token) => token.token === userBotToken)?.id;

					if (tokenId) {
						await updateTokenRateLimit(tokenId, timeInMilliseconds);
					}
					await new Promise((resolve) => setTimeout(resolve, timeInMilliseconds));
					await client.start({
						botAuthToken: token
					});
				}
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

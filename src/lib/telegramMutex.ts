import { Mutex } from 'async-mutex';
import { TelegramClient } from 'telegram';

// Create a singleton mutex for Telegram connections
const telegramMutex = new Mutex();

export async function withTelegramConnection<T>(
	client: TelegramClient | undefined,
	operation: (client: TelegramClient) => Promise<T>
): Promise<T> {
	if (!client) {
		throw new Error('Telegram client is not initialized');
	}

	if (!client.connected) {
		try {
			await client.connect();
		} catch (err) {
			console.error('mutex connec err', err);
		}
	}

	const release = await telegramMutex.acquire();
	try {
		const result = await operation(client);
		return result;
	} finally {
		release();
	}
}

export { telegramMutex };

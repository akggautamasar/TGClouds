import { Mutex } from 'async-mutex';
import { TelegramClient } from 'telegram';

// Create a singleton mutex for Telegram connections
const telegramMutex = new Mutex();

export async function withTelegramConnection<T>(
    client: TelegramClient | undefined,
    operation: () => Promise<T>
): Promise<T> {
    if (!client) {
        throw new Error('Telegram client is not initialized');
    }

    const release = await telegramMutex.acquire();

    try {
        if (!client.connected) {
            await client.connect();
        }

        const result = await operation();
        return result;
    } finally {
        if (client.connected) {
            await client.disconnect();
        }
        release();
    }
}

export { telegramMutex };

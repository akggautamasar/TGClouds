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

    if (!client.connected) {
        await client.connect();
    }

    const release = await telegramMutex.acquire();
    try {
        const result = await operation();
        return result;
    } finally {
        release();
    }
}

export { telegramMutex };

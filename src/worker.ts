'use client';

import { Api, client, TelegramClient } from 'telegram';
import { getTgClient } from './lib/getTgClient';
import Message, { User } from './lib/types';
import { blobCache, getChannelEntity } from './lib/utils';

self.addEventListener('message', async (e) => {
	const { id, type, user, client } = e.data as {
		type: 'getFIle';
		id: string;
		user: User;
		client: TelegramClient;
	};
	const blob = await downloadMedia(client, user, id);
	self.postMessage(blob);
});

const downloadMedia = async function (
	client: TelegramClient,
	user: User,
	message_id: number | string
): Promise<Blob | null> {
	const cacheKey = `${user?.channelId}-${message_id}`;
	if (blobCache.has(cacheKey)) {
		return blobCache.get(cacheKey)!;
	}

	try {
		if (!client.connected) await client?.connect();

		const message = (await client.getMessages(
			getChannelEntity(user?.channelId!, user?.accessHash!),
			{
				ids: [Number(message_id)]
			}
		)) as unknown as Message[];

		const media = message[0].media;

		if (media) {
			const buffer = await client.downloadMedia(media as unknown as Api.TypeMessageMedia, {
				progressCallback: (progress, total) => {
					const percent = (Number(progress) / Number(total)) * 100;
					console.log(percent);
				}
			});

			const blob = new Blob([buffer as unknown as Buffer]);
			blobCache.set(cacheKey, blob);
			return blob;
		}
	} catch (err) {
		console.log(err);
	} finally {
		await client.disconnect();
	}

	return null;
};

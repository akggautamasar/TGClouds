import { uploadFile } from '@/actions';
import { getTgClient, getBotClient } from '@/lib/getTgClient';
import TTLCache from '@isaacs/ttlcache';
import { type ClassValue, clsx } from 'clsx';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { Api, TelegramClient } from 'telegram';
import { TypeNotFoundError } from 'telegram/errors';
import { ChannelDetails, User } from './types';

import Message, { MessageMediaPhoto } from '@/lib/types';

type MediaSize = 'large' | 'small';
export type MediaCategory = 'video' | 'image' | 'document';

interface DownloadMediaOptions {
	user: NonNullable<User>;
	messageId: number | string;
	size: MediaSize;
	setURL: Dispatch<SetStateAction<string>>;
	category: MediaCategory;
	isShare?: boolean;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number) {
	const KB = 1024;
	const MB = KB * 1024;
	const GB = MB * 1024;

	if (bytes < KB) return `${bytes} Bytes`;
	if (bytes < MB) return `${(bytes / KB).toFixed(2)} KB`;
	if (bytes < GB) return `${(bytes / MB).toFixed(2)} MB`;

	return `${(bytes / GB).toFixed(2)} GB`;
}

export async function uploadFiles(
	formData: FormData,
	user: User,
	onProgress: Dispatch<
		SetStateAction<
			| {
					itemName: string;
					itemIndex: number;
					progress: number;
			  }
			| undefined
		>
	>,
	client: TelegramClient | undefined
) {
	if (!client) {
		throw new Error('Failed to initialize Telegram client');
	}
	if (!client?.connected) await client.connect();
	const files = formData.getAll('files') as File[];
	try {
		for (let index = 0; index < files.length; index++) {
			const file = files[index];
			const toUpload = await client.uploadFile({
				file: file,
				workers: 5,
				onProgress: (progress) => {
					onProgress({
						itemName: file.name,
						itemIndex: index,
						progress: progress
					});
				}
			});

			const result = await client.sendFile(getChannelEntity(user?.channelId!, user?.accessHash!), {
				file: toUpload,
				forceDocument: false
			});

			const uploadToDbResult = await uploadFile({
				fileName: file.name,
				mimeType: file.type,
				size: BigInt(file.size),
				url: !user?.hasPublicTgChannel
					? `https://t.me/c/${user?.channelId}/${result?.id}`
					: `https://t.me/${user?.channelUsername}/${result?.id}`,
				fileTelegramId: result.id
			});
			console.log('File uploaded successfully:', uploadToDbResult);
		}
	} catch (err) {
		if (err instanceof TypeNotFoundError) {
			throw new Error(err.message);
		}

		if (err instanceof Error) {
			throw new Error(err.message);
		}

		throw new Error('there was an error');
	} finally {
		await client.disconnect();
	}
}

export async function delelteItem(
	user: User,
	postId: number | string,
	client: TelegramClient | undefined
) {
	if (!client) return alert('You are not connected to Telegram');

	if (!client?.connected) {
		await client.connect();
	}
	try {
		const deleteMediaStatus = await client.deleteMessages(
			getChannelEntity(user?.channelId!, user?.accessHash!),
			[Number(postId)],
			{
				revoke: true
			}
		);
		return deleteMediaStatus;
	} catch (err) {
		if (err instanceof Error) {
			throw new Error(err.message);
		}
		if (err instanceof TypeNotFoundError) {
			throw new Error(err.message);
		}
		if (err && typeof err == 'object' && 'message' in err) {
			throw new Error(err.message as string);
		}
		return null;
	} finally {
		await client.disconnect();
	}
}

export async function getChannelDetails(client: TelegramClient, username: string) {
	if (!client) {
		alert('Telegram client is not initialized');
		throw new Error('Telegram client is not initialized');
	}

	if (!client?.connected) {
		await client.connect();
	}

	const entity = (await client.getEntity(username)) as unknown as ChannelDetails & {
		id: { value: string };
		broadcast: boolean;
		creator: any;
	};

	const channelDetails: Partial<ChannelDetails> = {
		title: entity.title,
		username: entity.username,
		channelusername: entity.id.value,
		isCreator: entity.creator,
		isBroadcast: entity.broadcast
	};

	client.disconnect();
	return channelDetails;
}

export function useCreateQueryString(
	searchParams: ReadonlyURLSearchParams
): (name: string, value: string) => string {
	return (name: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(name, value);
		return params.toString();
	};
}

export const getChannelEntity = (channelId: string, accessHash: string) => {
	return new Api.InputChannel({
		//@ts-ignore
		channelId: channelId,
		//@ts-ignore
		accessHash: accessHash
	});
};

export const blobCache = new TTLCache<string, Blob>({
	max: 100,
	ttl: 1000 * 60 * 60 * 24 * 7 // 1 week
});

export function getBannerURL(filename: string, isDarkMode: boolean) {
	const width = 600;
	const height = 500;
	const lightBackgroundColor = 'ffffff';
	const lightTextColor = '000000';
	const darkBackgroundColor = '000000';
	const darkTextColor = 'ffffff';

	const backgroundColor = isDarkMode ? darkBackgroundColor : lightBackgroundColor;
	const textColor = isDarkMode ? darkTextColor : lightTextColor;

	const bannerUrl = `https://via.placeholder.com/${width}x${height}/${backgroundColor}/${textColor}?text=${filename}`;
	return bannerUrl;
}

export function isDarkMode() {
	return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const getMessage = async ({
	messageId,
	client,
	user
}: Pick<DownloadMediaOptions, 'messageId' | 'user'> & {
	client: TelegramClient;
}) => {
	if (!client.connected) await client.connect();

	const result = (
		(await client.getMessages(getChannelEntity(user?.channelId!, user?.accessHash!), {
			ids: [Number(messageId)]
		})) as unknown as Message[]
	)[0];

	if (!result) return null;

	const media = result.media as Message['media'] | MessageMediaPhoto;
	return media;
};

export const downloadMedia = async ({
	user,
	messageId,
	size,
	setURL,
	category,
	isShare
}: DownloadMediaOptions): Promise<Blob | { fileExists :boolean} | null> => {
	if (!user || !user?.telegramSession || !user.channelId || !user.accessHash)
		throw new Error('failed to get user');

	const cacheKey = `${user?.channelId}-${messageId}`;

	if (blobCache.has(cacheKey)) {
		return blobCache.get(cacheKey)!;
	}

	const client = getTgClient(user?.telegramSession);

	const media = await getMessage({ client, messageId, user });

	if (!media) return { fileExists: false };

	try {
		if (!client.connected) await client.connect();

		if (category === 'video')
			return await handleVideoDownload(client, media as Message['media'], setURL);

		if (media) return await handleMediaDownload(client, media, size, cacheKey, setURL);
	} catch (err) {
		console.error(err);
	} finally {
		await client.disconnect();
	}

	return null;
};

export const handleVideoDownload = async (
	client: TelegramClient,
	media: Message['media'],
	setURL: Dispatch<SetStateAction<string>>
): Promise<null> => {
	const mediaSource = new MediaSource();
	const url = URL.createObjectURL(mediaSource);
	setURL(url);

	mediaSource.onsourceopen = async () => {
		const mimeCodec = `video/mp4; codecs="avc1.64001F"`;
		const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
		const buffers: Buffer[] = [];

		for await (const buffer of client.iterDownload({
			file: media as unknown as Api.TypeMessageMedia,
			requestSize: 1024 * 1024 * 2
		})) {
			buffers.push(buffer);
			const url = URL.createObjectURL(new Blob(buffers));
			setURL(url);

			await new Promise((resolve) => {
				sourceBuffer.addEventListener('updateend', resolve, { once: true });
			});
		}

		sourceBuffer.addEventListener('updateend', () => {
			if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
				mediaSource.endOfStream();
			}
		});
	};

	return null;
};

export const handleMediaDownload = async (
	client: TelegramClient,
	media: Message['media'] | MessageMediaPhoto,
	size: MediaSize,
	cacheKey: string,
	setURL: Dispatch<SetStateAction<string>>
): Promise<Blob | null> => {
	const buffer = await client.downloadMedia(media as unknown as Api.TypeMessageMedia, {
		progressCallback: (progress, total) => {
			const percent = (Number(progress) / Number(total)) * 100;
			console.log(percent);
		},
		thumb: size === 'small' ? 0 : undefined
	});
	const blob = new Blob([buffer as unknown as Buffer]);
	blobCache.set(cacheKey, blob);
	setURL(URL.createObjectURL(blob));

	return blob;
};

export const downloadVideoThumbnail = async (
	user: User,
	client: TelegramClient,
	media: Message['media']
) => {
	if (!client.connected) await client.connect();
	const thumbnail = media.document.thumbs;

	if (!thumbnail) return;

	const buffer = await client.downloadMedia(media as unknown as Api.TypeMessageMedia, {
		thumb: 1
	});

	if (!buffer) return;

	return buffer;
};

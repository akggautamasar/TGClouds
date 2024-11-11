'use client';
import { clearCookies, deleteFile, shareFile, deleteChannelDetail } from '@/actions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getGlobalTGCloudContext } from '@/lib/context';
import { promiseToast } from '@/lib/notify';
import Message, { FilesData, User } from '@/lib/types';
import {
	delelteItem,
	downloadMedia,
	downloadVideoThumbnail,
	formatBytes,
	getBannerURL,
	getMessage,
	isDarkMode,
	MediaCategory,
	canWeAccessTheChannel
} from '@/lib/utils';
import fluidPlayer from 'fluid-player';
import { Play, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CloudDownload, ImageIcon, Trash2Icon, VideoIcon } from './Icons/icons';
import FileContextMenu from './fileContextMenu';
import { FileModalView } from './fileModalView';
import Upload from './uploadWrapper';
import { RPCError } from 'telegram/errors';
import { Button } from '@/components/ui/button';

import Swal from 'sweetalert2';
import { Api, TelegramClient } from 'telegram';

export function showSharableURL(url: string) {
	Swal.fire({
		title: 'Your Sharable Link',
		html: `
      <div>
        <input id="sharable-url" class="swal2-input" value="${url}" readonly>
        <button id="copy-button" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Copy Link</button>
      </div>
    `,
		showConfirmButton: false,
		didOpen: () => {
			const copyButton = document.getElementById('copy-button');
			const sharableUrlInput = document.getElementById('sharable-url') as HTMLInputElement;

			copyButton?.addEventListener('click', async () => {
				sharableUrlInput.select();
				const sharableURL = sharableUrlInput?.value;
				try {
					await navigator.clipboard.writeText(sharableURL);
					Swal.fire({
						icon: 'success',
						title: 'Copied!',
						showConfirmButton: false,
						timer: 1500
					});
				} catch (err) {
					console.error(err);
				}
			});
		}
	});
}

const checkSessionStatus = async (client: TelegramClient) => {
	try {
		if (!client.connected) await client.connect();
		const isAuthorized = await client.checkAuthorization();
		return isAuthorized;
	} catch (error) {
		if (error instanceof RPCError) {
			if (error.errorMessage === 'AUTH_KEY_UNREGISTERED') {
				console.error(error.errorMessage);
			}
		}
		console.error('Error checking session status:', error);
		return false;
	}
};

function Files({ user, files }: { user: User; mimeType?: string; files: FilesData | undefined }) {
	const TGCloudGlobalContext = getGlobalTGCloudContext();
	const sortBy = TGCloudGlobalContext?.sortBy;
	const client = TGCloudGlobalContext?.TGClient as TelegramClient;
	const telegramSession = TGCloudGlobalContext?.telegramSession;
	const [sessionChecked, setSessionChecked] = useState(false);
	const [isValidSession, setIsValidSession] = useState(true);
	const [canWeAccessTGChannel, setCanWeAccessTGChannel] = useState<boolean | 'INITIAL'>('INITIAL');
	const router = useRouter();

	useEffect(() => {
		if (!telegramSession) {
			return;
		}
		(async () => {
			client.on((ev) => {
				alert(JSON.stringify(ev));
			});

			const isValid = await checkSessionStatus(client);
			const connStatus = client.connected ? 'connected' : 'disconnected';

			TGCloudGlobalContext.setConnectionStatus(connStatus);
			setSessionChecked(true);
			setIsValidSession(!!isValid);
			const result = await canWeAccessTheChannel(client, user);
			setCanWeAccessTGChannel(!!result);

			client.addEventHandler((event: { name: string }) => {
				alert(event.name);
				switch (event.name) {
					case 'ready':
						console.log('Connected successfully');
						break;
					case 'disconnected':
						console.log('Disconnected');
						break;
					case 'message':
						console.log('Received message:', event.message);
						break;
				}
			});
		})();
	}, [telegramSession]);

	if (!sessionChecked) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!isValidSession) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center space-y-4">
					<h2 className="text-xl font-semibold">Unable to Access Your Telegram Account</h2>
					<p className="text-muted-foreground">
						We&apos;ve lost access to your Telegram account. This can happen if you logged out of
						Telegram or revoked access. Please re-authorize TGCloud to continue using the service.
					</p>
					<Button onClick={() => clearCookies()} variant="default">
						Authorize TGCloud
					</Button>
				</div>
			</div>
		);
	}

	if (canWeAccessTGChannel !== 'INITIAL' && !canWeAccessTGChannel)
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center space-y-4">
					<h2 className="text-xl font-semibold">Unable to Access Channel</h2>
					<p className="text-muted-foreground">
						We cannot access the Telegram channel. Have you deleted the channel?
					</p>
					<div className="flex gap-4 justify-center">
						<Button onClick={() => deleteChannelDetail()} variant="destructive">
							Yes, I deleted it
						</Button>
						<Button onClick={() => router.push('/')} variant="outline">
							No, I didn&apos;t
						</Button>
					</div>
				</div>
			</div>
		);

	const sortedFiles = (() => {
		if (!files || !files?.length) return [];
		if (sortBy == 'name') return files.sort((a, b) => a.fileName.localeCompare(b.fileName));
		if (sortBy == 'date') return files.sort((a, b) => a.date!.localeCompare(b?.date!));
		if (sortBy == 'size') return files.sort((a, b) => Number(a.size) - Number(b.size));
		return files.sort((a, b) => a.mimeType.localeCompare(b.mimeType));
	})();

	if (!sortedFiles?.length)
		return (
			<>
				<div className="flex flex-col items-center justify-center h-full">
					<div className="text-center space-y-4">
						<h2 className="text-2xl font-bold">No files found</h2>
						<p className="text-muted-foreground">
							You haven&apos;t uploaded any files yet. Click the button below to get started.
						</p>
						<div>
							<Upload user={user} />
						</div>
					</div>
				</div>
			</>
		);

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{sortedFiles?.map((file) => (
				<EachFile key={file.id} file={file} user={user} />
			))}
		</div>
	);
}

export default Files;

const addBotToChannel = async (client: TelegramClient, user: User) => {
	if (!client.connected) await client.connect();
	if (!user?.channelId || !user.accessHash) throw Error('Failed to create sharable url');

	const adminRights = new Api.ChatAdminRights({
		changeInfo: true,
		postMessages: true,
		editMessages: true,
		deleteMessages: true,
		banUsers: true,
		inviteUsers: true,
		pinMessages: true,
		addAdmins: true,
		manageCall: true,
		anonymous: true,
		manageTopics: true
	});
};

function EachFile({ file, user }: { file: FilesData[number]; user: User }) {
	const TGCloudGlobalContext = getGlobalTGCloudContext();
	const telegramSession = TGCloudGlobalContext?.telegramSession;
	const client = TGCloudGlobalContext?.TGClient as TelegramClient;
	const [url, setURL] = useState<string>('/placeholder.svg');
	const [thumbNailURL, setThumbnailURL] = useState('/placeholder.svg');
	const [isFileNotFoundInTelegram, setFileNotFoundInTelegram] = useState(false);

	const downlaodFile = async (size: 'large' | 'small', category: string) => {
		const result = await downloadMedia(
			{
				user: user as NonNullable<User>,
				messageId: file?.fileTelegramId,
				size,
				setURL,
				category: file.category as MediaCategory
			},
			telegramSession,
			client
		);
		if (
			result &&
			typeof result === 'object' &&
			'fileExists' in result &&
			result.fileExists === false
		) {
			setFileNotFoundInTelegram(true);
		}
	};

	const router = useRouter();

	useEffect(() => {
		file.category == 'video'
			? (async () => {
					const media = (await getMessage({
						client,
						messageId: file.fileTelegramId,
						user: user as NonNullable<User>
					})) as Message['media'];
					const buffer = await downloadVideoThumbnail(user, client, media);
					if (buffer) {
						const blob = new Blob([buffer]);
						const url = URL.createObjectURL(blob);
						setThumbnailURL(url);
						return;
					}
					const url = getBannerURL('No Thumbnail Available', isDarkMode());
					setThumbnailURL(url);
			  })()
			: null;

		downlaodFile('small', file.category);
		requestIdleCallback((e) => {
			downlaodFile('large', file.category);
		});

		return () => {
			URL.revokeObjectURL(url as string);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file.category]);

	const fileContextMenuActions = [
		{
			actionName: 'save',
			onClick: async () => {
				if (!url) return;
				const link = document.createElement('a');
				link.href = url!;
				link.download = file.fileName!;
				link.click();
			},
			Icon: CloudDownload,
			className: `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${
				!url ? 'cursor-not-allowed opacity-50' : ''
			}`
		},
		{
			actionName: 'delete',
			onClick: async () => {
				const promies = () =>
					Promise.all([deleteFile(file.id), delelteItem(user, file.fileTelegramId, client)]);

				promiseToast({
					cb: promies,
					errMsg: 'Failed to Delete the file',
					loadingMsg: 'please wait',
					successMsg: 'you have successfully deleted the file',
					position: 'top-center'
				}).then(() => router.refresh());
			},
			Icon: Trash2Icon,
			className:
				'flex items-center text-red-500 gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-red-600'
		},
		{
			actionName: 'share',
			onClick: async () => {
				try {
					await addBotToChannel(client, user);
					const result = await shareFile({ fileID: file.fileTelegramId });
					const url = `${location.host}/share/${result?.[0].id}`;
					showSharableURL(url);
				} catch (err) {
					console.error(err);
				}
			},
			Icon: Share2 as typeof Trash2Icon,
			className:
				'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted '
		}
	];

	const bannerURL =
		file.category == 'application' ? getBannerURL(file.fileName, isDarkMode()) : null;

	const fileNotFoundBannerURL = isFileNotFoundInTelegram
		? getBannerURL('File Not Found In Telegram', isDarkMode())
		: null;

	return (
		<FileContextMenu fileContextMenuActions={fileContextMenuActions}>
			<Card
				id={url}
				className={`group relative  overflow-hidden rounded-lg shadow-sm   transition-all hover:shadow-md `}
			>
				{/* <Link target="_blank" href={file.url} prefetch={false}> */}
				<span className="sr-only">View file</span>
				{file.category == 'image' ? (
					<FileModalView
						id={file.id}
						ItemThatWillShowOnModal={() => (
							<ImagePreviewModal
								fileData={{ ...file, category: 'image' }}
								url={fileNotFoundBannerURL ?? url!}
							/>
						)}
					>
						<ImageRender fileName={file.fileName} url={fileNotFoundBannerURL ?? url!} />
					</FileModalView>
				) : null}
				{file.category == 'application' ? (
					<ImageRender fileName={file.fileName} url={fileNotFoundBannerURL ?? bannerURL!} />
				) : null}
				{/* </Link> */}

				{file.category == 'video' ? (
					<>
						<FileModalView
							id={file.id}
							ItemThatWillShowOnModal={() => (
								<VideoMediaView fileData={{ ...file, category: 'video' }} url={url!} />
							)}
						>
							<div className="w-full h-full relative">
								<ImageRender fileName={file.fileName} url={thumbNailURL} />
								<div className="absolute top-[45%] left-[45%] transform translate-x-[-50%] translate-y-[-50%]">
									<Play
										className="text-black bg-white p-2 rounded-full
                   h-14 w-14"
									/>
								</div>
							</div>
						</FileModalView>
					</>
				) : null}

				<CardContent className="p-5 relative">
					<div className="flex items-center justify-between">
						<div className="truncate font-medium">{file.fileName}</div>
						<Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
							{file.mimeType}
						</Badge>
					</div>
					<div className="mt-3 text-sm text-muted-foreground">
						<div className="flex justify-between items-center gap-3">
							<div>Size: {formatBytes(Number(file.size))}</div>
							<div>Date:{file.date}</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</FileContextMenu>
	);
}

function ImageRender({ url, fileName }: { url: string; fileName: string }) {
	const [width, setWidth] = useState<number | null>(null);
	useEffect(() => {
		const element = document.getElementById(url);
		if (!element) {
			return;
		}
		const width = element.clientWidth;
		setWidth(width);
	}, []);
	return (
		<Image
			src={url ?? '/placeholder.svg'}
			alt={fileName}
			width={1920}
			height={1080}
			style={{
				minWidth: width ? width + 'px' : 'inhrit',
				aspectRatio: '1/1',
				objectFit: 'cover',
				objectPosition: 'center'
			}}
			className={`object-center w-full h-auto object-cover transition-opacity group-hover:opacity-50`}
		/>
	);
}

function VideoMediaView({
	fileData,
	url
}: {
	fileData: Omit<FilesData[number], 'category'> & { category: 'video' };
	url: string;
}) {
	let self = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<FluidPlayerInstance>(undefined);

	useEffect(() => {
		if (!playerRef.current) {
			playerRef.current = fluidPlayer(self.current!, {
				layoutControls: {
					allowDownload: true,
					miniPlayer: {
						autoToggle: true,
						enabled: true,
						position: 'bottom right',
						height: 200,
						width: 300,
						placeholderText: fileData.fileName
					}
				}
			});
		}
	}, []);

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto">
				<div className="relative aspect-video">
					<video
						ref={self}
						controls
						autoPlay
						className="w-full h-full object-contain"
						src={url}
					></video>
				</div>
				<div className="p-6 bg-background">
					<h3 className="text-2xl font-semibold">{fileData.fileName}</h3>
					<div className="flex items-center gap-2 text-muted-foreground">
						<VideoIcon className="w-5 h-5" />
						<span>{formatBytes(Number(fileData.size))}</span>
					</div>
					<div className="grid gap-2 mt-4">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">File Name:</span>
							<span>{fileData.fileName}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">File Size:</span>
							<span>{formatBytes(Number(fileData.size))}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function ImagePreviewModal({
	fileData,
	url
}: {
	fileData: Omit<FilesData[number], 'category'> & { category: 'image' };
	url: string;
}) {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto">
				<div className="relative aspect-video">
					<Image
						property="1"
						src={url}
						alt={fileData.fileName}
						width={1920}
						height={1080}
						className="w-full h-full object-contain"
					/>
				</div>
				<div className="p-6 bg-background">
					<h3 className="text-2xl font-semibold">{fileData.fileName}</h3>
					<div className="flex items-center gap-2 text-muted-foreground">
						<ImageIcon className="w-5 h-5" />
						<span>{formatBytes(Number(fileData.size))}</span>
					</div>{' '}
					<div className="grid gap-2 mt-4">
						{' '}
						<div className="flex items-center justify-between">
							{' '}
							<span className="text-muted-foreground">File Name:</span>{' '}
							<span>{fileData.fileName}</span>{' '}
						</div>{' '}
						<div className="flex items-center justify-between">
							{' '}
							<span className="text-muted-foreground">File Size:</span>{' '}
							<span>{formatBytes(Number(fileData.size))}</span>{' '}
						</div>{' '}
					</div>{' '}
				</div>{' '}
			</div>{' '}
		</div>
	);
}

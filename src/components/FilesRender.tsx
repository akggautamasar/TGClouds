"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTgClient } from "@/lib/getTgClient";
import fluidPlayer from "fluid-player";

import {
  blobCache,
  delelteItem,
  formatBytes,
  getBannerURL,
  getChannelEntity,
  isDarkMode,
} from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import FileContextMenu from "./fileContextMenu";

import {
  Dispatch,
  SetStateAction,
  use,
  useEffect,
  useRef,
  useState,
} from "react";

import { Api, TelegramClient } from "telegram";

import { deleteFile } from "@/actions";
import { SortByContext } from "@/lib/context";
import { promiseToast } from "@/lib/notify";
import Message, { FilesData, MessageMediaPhoto, User } from "@/lib/types";
import { CloudDownload, ImageIcon, Trash2Icon, VideoIcon } from "./Icons/icons";
import { FileModalView } from "./fileModalView";
import Upload from "./uploadWrapper";
import { Play } from "lucide-react";

type MediaSize = "large" | "small";
type MediaCategory = "video" | "photo" | "document";

interface DownloadMediaOptions {
  user: NonNullable<User>;
  messageId: number | string;
  size: MediaSize;
  setURL: Dispatch<SetStateAction<string | null>>;
  category: MediaCategory;
}

const getMessage = async ({
  messageId,
  client,
  user,
}: Pick<DownloadMediaOptions, "messageId" | "user"> & {
  client: TelegramClient;
}) => {
  if (!client.connected) await client.connect();
  const messages = (await client.getMessages(
    getChannelEntity(user?.channelId!, user?.accessHash!),
    {
      ids: [Number(messageId)],
    }
  )) as unknown as Message[];

  const media = messages?.[0]?.media as Message["media"] | MessageMediaPhoto;
  return media;
};

const downloadMedia = async ({
  user,
  messageId,
  size,
  setURL,
  category,
}: DownloadMediaOptions): Promise<Blob | null> => {
  if (!user || !user?.telegramSession || !user.channelId || !user.accessHash)
    throw new Error("failed to get user");

  const cacheKey = `${user?.channelId}-${messageId}`;

  if (blobCache.has(cacheKey)) {
    return blobCache.get(cacheKey)!;
  }
  const client = getTgClient(user?.telegramSession);
  const media = await getMessage({ client, messageId, user });
  try {
    if (!client.connected) await client.connect();

    if (category === "video") {
      return await handleVideoDownload(
        client,
        media as Message["media"],
        setURL
      );
    }

    if (media) {
      return await handleMediaDownload(client, media, size, cacheKey, setURL);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.disconnect();
  }

  return null;
};

const handleVideoDownload = async (
  client: TelegramClient,
  media: Message["media"],
  setURL: Dispatch<SetStateAction<string | null>>
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
      requestSize: 1024 * 1024 * 2,
    })) {
      buffers.push(buffer);
      const url = URL.createObjectURL(new Blob(buffers));
      setURL(url);

      await new Promise((resolve) => {
        sourceBuffer.addEventListener("updateend", resolve, { once: true });
      });
    }

    sourceBuffer.addEventListener("updateend", () => {
      if (!sourceBuffer.updating && mediaSource.readyState === "open") {
        mediaSource.endOfStream();
      }
    });
  };

  return null;
};

const handleMediaDownload = async (
  client: TelegramClient,
  media: Message["media"] | MessageMediaPhoto,
  size: MediaSize,
  cacheKey: string,
  setURL: Dispatch<SetStateAction<string | null>>
): Promise<Blob | null> => {
  const buffer = await client.downloadMedia(
    media as unknown as Api.TypeMessageMedia,
    {
      progressCallback: (progress, total) => {
        const percent = (Number(progress) / Number(total)) * 100;
        console.log(percent);
      },
      thumb: size === "small" ? 0 : undefined,
    }
  );
  const blob = new Blob([buffer as unknown as Buffer]);
  blobCache.set(cacheKey, blob);
  setURL(URL.createObjectURL(blob));

  return blob;
};

const downloadVideoThumbnail = async (
  user: User,
  client: TelegramClient,
  media: Message["media"]
) => {
  if (!client.connected) await client.connect();
  const thumbnail = media.document.thumbs;

  if (!thumbnail) return;

  const buffer = await client.downloadMedia(
    media as unknown as Api.TypeMessageMedia,
    {
      thumb: 1,
    }
  );

  if (!buffer) return;

  return buffer;
};

function Files({
  user,
  files,
}: {
  user: User;
  mimeType?: string;
  files: FilesData | undefined;
}) {
  const { sortBy } = use(SortByContext)!;

  const [progress, setProgress] = useState(0);
  const sortedFiles = (() => {
    if (!files || !files?.length) return [];
    if (sortBy == "name")
      return files.sort((a, b) => a.fileName.localeCompare(b.fileName));
    if (sortBy == "date")
      return files.sort((a, b) => a.date!.localeCompare(b?.date!));
    if (sortBy == "size")
      return files.sort((a, b) => Number(a.size) - Number(b.size));
    return files.sort((a, b) => a.mimeType.localeCompare(b.mimeType));
  })();

  if (!sortedFiles?.length)
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">No files found</h2>
            <p className="text-muted-foreground">
              You haven&apos;t uploaded any files yet. Click the button below to
              get started.
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
      {sortedFiles?.map((file, index) => (
        <EachFile key={file.id} file={file} user={user} />
      ))}
    </div>
  );
}

export default Files;

function EachFile({ file, user }: { file: FilesData[number]; user: User }) {
  const client = getTgClient(user?.telegramSession as string);
  const [url, setURL] = useState<string | null>(null);
  const [thumbNailURL, setThumbnailURL] = useState("/placeholder.svg");

  const downlaodFile = async (size: "large" | "small", category: string) => {
    await downloadMedia({
      user: user as NonNullable<User>,
      messageId: file?.fileTelegramId,
      size,
      setURL,
      category: file.category as MediaCategory,
    });
  };

  const router = useRouter();

  useEffect(() => {
    file.category == "video"
      ? (async () => {
          const client = getTgClient(user?.telegramSession!);
          const media = (await getMessage({
            client,
            messageId: file.fileTelegramId,
            user: user as NonNullable<User>,
          })) as Message["media"];
          const buffer = await downloadVideoThumbnail(user, client, media);
          if (buffer) {
            const blob = new Blob([buffer]);
            const url = URL.createObjectURL(blob);
            setThumbnailURL(url);
            return;
          }
          const url = getBannerURL("No Thumbnail Available", isDarkMode());
          setThumbnailURL(url);
        })()
      : null;

    downlaodFile("small", file.category);

    requestIdleCallback((e) => {
      downlaodFile("large", file.category);
    });

    return () => {
      URL.revokeObjectURL(url as string);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.category]);

  const fileContextMenuActions = [
    {
      actionName: "save",
      onClick: async () => {
        if (!url) return;

        const link = document.createElement("a");
        link.href = url!;
        link.download = file.fileName!;

        link.click();
      },
      Icon: CloudDownload,
      className: `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${
        !url ? "cursor-not-allowed opacity-50" : ""
      }`,
    },
    {
      actionName: "delete",
      onClick: async () => {
        const promies = () =>
          Promise.all([
            deleteFile(file.id),
            delelteItem(user, file.fileTelegramId, client),
          ]);

        promiseToast({
          cb: promies,
          errMsg: "Failed to Delete the file",
          loadingMsg: "please wait",
          successMsg: "you have successfully deleted the file",
          position: "top-center",
        }).then(() => router.refresh());
      },
      Icon: Trash2Icon,
      className:
        "flex items-center text-red-500 gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-red-600",
    },
  ];

  const bannerURL =
    file.category == "application"
      ? getBannerURL(file.fileName, isDarkMode())
      : null;

  return (
    <FileContextMenu fileContextMenuActions={fileContextMenuActions}>
      <Card className="group relative overflow-hidden rounded-lg shadow-sm   transition-all hover:shadow-md">
        {/* <Link target="_blank" href={file.url} prefetch={false}> */}
        <span className="sr-only">View file</span>
        {file.category == "image" ? (
          <FileModalView
            id={file.id}
            ItemThatWillShowOnModal={() => (
              <ImagePreviewModal
                fileData={{ ...file, category: "image" }}
                url={url!}
              />
            )}
          >
            <ImageRender fileName={file.fileName} url={url!} />
          </FileModalView>
        ) : null}
        {file.category == "application" ? (
          <ImageRender fileName={file.fileName} url={bannerURL!} />
        ) : null}
        {/* </Link> */}

        {file.category == "video" ? (
          <>
            <FileModalView
              id={file.id}
              ItemThatWillShowOnModal={() => (
                <VideoMediaView
                  fileData={{ ...file, category: "video" }}
                  url={url!}
                />
              )}
            >
              <div className="w-full h-full relative">
                <ImageRender fileName={file.fileName} url={thumbNailURL} />
                <div className="absolute top-[45%] left-[45%] transform translate-x-[-50%] translate-y-[-50%]">
                  <Play className="text-black bg-white p-2 rounded-full
                   h-14 w-14" />
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
  return (
    <Image
      src={url ?? "/placeholder.svg"}
      alt={fileName}
      width={299}
      height={199}
      className="aspect-square object-center w-full object-cover transition-opacity group-hover:opacity-50"
    />
  );
}

function VideoMediaView({
  fileData,
  url,
}: {
  fileData: Omit<FilesData[number], "category"> & { category: "video" };
  url: string;
}) {
  let self = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<FluidPlayerInstance>();

  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = fluidPlayer(self.current!, {
        layoutControls: {
          allowDownload: true,
          miniPlayer: {
            autoToggle: true,
            enabled: true,
            position: "bottom right",
            height: 200,
            width: 300,
            placeholderText: fileData.fileName,
          },
        },
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
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Resolution:</span>
              <span>1920 x 1080</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>10 min 3 sec</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImagePreviewModal({
  fileData,
  url,
}: {
  fileData: Omit<FilesData[number], "category"> & { category: "image" };
  url: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="relative aspect-video">
          <Image
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
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Resolution:</span>
              <span>1920 x 1080</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

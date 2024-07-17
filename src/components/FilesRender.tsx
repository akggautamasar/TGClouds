"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTgClient } from "@/lib/getTgClient";
import {
  blobCache,
  delelteItem,
  formatBytes,
  getChannelEntity,
} from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "./Link";
import FileContextMenu from "./fileContextMenu";

import Circle from "react-circle";

import {
  Dispatch,
  SetStateAction,
  Suspense,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Api, TelegramClient } from "telegram";

import { deleteFile } from "@/actions";
import { SortByContext } from "@/lib/context";
import { promiseToast } from "@/lib/notify";
import Message, { FilesData, MessageMediaPhoto, User } from "@/lib/types";
import { CloudDownload, Trash2Icon } from "./Icons/icons";
import Upload from "./uploadWrapper";
import { message } from "telegram/client";
import { File } from "buffer";

const downloadMedia = async function (
  user: User,
  message_id: number | string,
  setProgress: Dispatch<SetStateAction<number>>,
  size: "large" | "small",
  category: string
): Promise<Blob | null> {
  const cacheKey = `${user?.channelId}-${message_id}`;
  if (blobCache.has(cacheKey)) {
    return blobCache.get(cacheKey)!;
  }

  const client = getTgClient(user?.telegramSession!);

  try {
    if (!client.connected) await client?.connect();

    const message = (await client.getMessages(
      getChannelEntity(user?.channelId!, user?.accessHash!),
      {
        ids: [Number(message_id)],
      }
    )) as unknown as Message[];

    const media = message[0].media as Message["media"] | MessageMediaPhoto;

    if (media) {
      if (size == "small" && category == "image") {
        const buffer = await client.downloadMedia(
          media as unknown as Api.TypeMessageMedia,
          {
            progressCallback: (progress, total) => {
              const percent = (Number(progress) / Number(total)) * 100;
              setProgress(Number(percent?.toFixed(2)));
            },
            thumb: 0,
          }
        );

        const blob = new Blob([buffer as unknown as Buffer]);

        blobCache.set(cacheKey, blob);

        return blob;
      }
      const buffer = await client.downloadMedia(
        media as unknown as Api.TypeMessageMedia,
        {
          progressCallback: (progress, total) => {
            const percent = (Number(progress) / Number(total)) * 100;
            setProgress(Number(percent?.toFixed(2)));
          },
        }
      );

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

  const searchParams = useSearchParams();

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
        <Suspense
          key={file.id}
          fallback={
            <FileDownloadProgress file={file} downloadProgress={progress} />
          }
        >
          <EachFile setProgress={setProgress} file={file} user={user} />
        </Suspense>
      ))}
    </div>
  );
}

export default Files;

function EachFile({
  file,
  setProgress,
  user,
}: {
  file: FilesData[number];
  user: User;
  setProgress: Dispatch<SetStateAction<number>>;
}) {
  const client = getTgClient(user?.telegramSession as string);
  const [url, setURL] = useState<string | null>(null);
  const [downloadAbleFile, setFile] = useState<File>();

  const downlaodFile = async (size: "large" | "small", category: string) => {
    const blob = await downloadMedia(
      user,
      file?.fileTelegramId,
      setProgress,
      size,
      category
    );

    const url = URL.createObjectURL(blob!);
    setURL(url);
    return;
  };

  const router = useRouter();

  useEffect(() => {
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
        if (!downloadAbleFile) removeEventListener;

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

  return (
    <FileContextMenu fileContextMenuActions={fileContextMenuActions}>
      <Card className="group relative overflow-hidden rounded-lg shadow-sm   transition-all hover:shadow-md">
        <Link target="_blank" href={file.url} prefetch={false}>
          <span className="sr-only">View file</span>
          {file.category == "image" ? (
            <ImageRender fileName={file.fileName} url={url!} />
          ) : (
            <div className="w-full text-center">
              <span className="text-center font-bold">
                {file.mimeType.split("/")[1]}
              </span>
            </div>
          )}
        </Link>

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

function FileDownloadProgress({
  downloadProgress,
  file,
}: {
  downloadProgress: number;
  file: FilesData[number];
}) {
  return (
    <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
      <div>
        <Circle progress={downloadProgress} />
      </div>

      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className="truncate font-medium">{file.fileName}</div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            {file.mimeType}
          </Badge>
        </div>
        <div className="mt-3 text-sm text-muted-foreground"></div>
      </CardContent>
    </Card>
  );
}

function ImageRender({ url, fileName }: { url: string; fileName: string }) {
  return (
    <Image
      src={url ?? "/placeholder.svg"}
      alt={fileName}
      width={299}
      height={199}
      className="h-41 aspect-square object-center w-full object-cover transition-opacity group-hover:opacity-50"
    />
  );
}

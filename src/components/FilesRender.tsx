"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTgClient } from "@/lib/getTgClient";
import {
  blobCache,
  delelteItem,
  formatBytes,
  getChannelEntity,
} from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "./Link";
import FileContextMenu from "./fileContextMenu";

import Circle from "react-circle";

import {
  Dispatch,
  SetStateAction,
  Suspense,
  use,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Api } from "telegram";

import { deleteFile } from "@/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SortByContext } from "@/lib/context";
import { promiseToast } from "@/lib/notify";
import Message, { FilesData, User } from "@/lib/types";
import { LRUCache } from "lru-cache";
import { CloudDownload } from "./Icons/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Upload from "./uploadWrapper";

const downloadMedia = async function (
  user: User,
  message_id: number | string,
  setProgress: Dispatch<SetStateAction<number>>
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

    const media = message[0].media;

    if (media) {
      const buffer = await client.downloadMedia(
        media as unknown as Api.TypeMessageMedia,
        {
          progressCallback: (progress, total) => {
            const percent = (Number(progress) / Number(total)) * 100;
            setProgress(Number(percent?.toFixed(2)));
          },
          // thumb: 0,
        }
      );

      const blob = new Blob([buffer as unknown as Buffer]);

      blobCache.set(cacheKey, blob);

      return blob;
    }
  } catch (err) {
    console.log(err);
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

  const sortedFiles = useMemo(() => {
    if (!files || !files?.length) return [];
    if (sortBy == "name")
      return files.sort((a, b) => a.fileName.localeCompare(b.fileName));
    if (sortBy == "date")
      return files.sort((a, b) => a.date!.localeCompare(b?.date!));
    if (sortBy == "size")
      return files.sort((a, b) => Number(a.size) - Number(b.size));
    return files.sort((a, b) => a.mimeType.localeCompare(b.mimeType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

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

  useEffect(() => {
    if (file.mimeType !== "image") return;
    downlaodFile();
  }, []);

  async function downlaodFile() {
    const blob = await downloadMedia(user, file?.fileTelegramId, setProgress);

    const url = URL.createObjectURL(blob!);
    setURL(url);
  }
  const router = useRouter();
  
  const fileContextMenuActions = [
    { actionName: "save", onClick: async () => downlaodFile() },
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
    },
  ];




  return (
    <FileContextMenu fileContextMenuAction={fileContextMenuActions}>
      <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
        <Link target="_blank" href={file.url} prefetch={false}>
          <span className="sr-only">View file</span>
          <Image
            src={url ?? "/placeholder.svg"}
            alt={file.fileName}
            width={299}
            height={199}
            className="h-41 aspect-square object-center w-full object-cover transition-opacity group-hover:opacity-50"
          />
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

function ConfirmDeleteAction({
  onConfirm,
  children,
}: {
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your file
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onConfirm} autoFocus>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function UserItemActions({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>...</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{children}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

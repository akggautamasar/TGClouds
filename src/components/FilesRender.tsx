"use client";
import { FilesData } from "@/app/files/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTgClient } from "@/lib/getTgClient";
import { delelteItem, formatBytes } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cache, Dispatch, SetStateAction, useEffect, useState } from "react";

import { Api, TelegramClient } from "telegram";

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
import { errorToast, successToast } from "@/lib/notify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Upload from "./uploadWrapper";

export type User = {
  id: string;
  name: string;
  email: string;
  telegramSession: string;
  channelUsername: string;
  channelId: string | null;
};

const getAllFiles = cache(async (client: TelegramClient, user: User) => {
  const limit = 8;
  let offsetId = 0;
  let allMessages: Api.Message[] = [];
  let hasMore = true;

  try {
    alert("Connecting to Telegram client...");
    alert("Connection status" + client.connected);

    if (!client.connected) await client.connect();

    while (hasMore) {
      console.log(`Fetching messages with offsetId: ${offsetId}`);

      alert("Connecting to Telegram client...");
      alert("Connection status" + client.connected);
      const result = await client.getMessages(user?.channelUsername, {
        limit: limit,
        offsetId: offsetId,
      });

      alert(`Fetched ${result.length} messages`);

      allMessages = allMessages.concat(result);
      if (result.length < limit) {
        hasMore = false;
      } else {
        offsetId = result[result.length - 1].id;
      }
    }

    return allMessages
      .filter((message) => message.file)
      .map(({ file, id }) => {
        return {
          //@ts-ignore
          fileName: file?.title,
          name: file?.name,
          size: formatBytes(file?.size as number),
          src: `https://t.me/${user.channelUsername}/${id}`,
          type: file?.mimeType as string,
          id,
        } satisfies FilesData;
      });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err?.message);
    }
    console.warn(err);
    throw Error(JSON.stringify(err));
  } finally {
    await client.disconnect();
  }
  return null;
});

async function downloadMedia(
  client: TelegramClient,
  user: User,
  message_id: number,
  setProgress: Dispatch<SetStateAction<number>>
) {
  //TODO: implenet downloding in web worker
  if (!client.connected) await client.connect();
  const message = await client.getMessages(user.channelUsername, {
    ids: [message_id],
  });

  const media = message[0].media;
  if (media) {
    const buffer = await client.downloadMedia(media, {
      progressCallback: (progress) => setProgress(Number(progress)),
    });
    const blob = new Blob([buffer as unknown as Buffer]);
    return blob;
  }
}

function Files({
  user,
  files,
}: {
  user: User;
  mimeType?: string;
  files: FilesData | undefined;
}) {
  if (!files?.length)
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
      {files?.map((file, index) => (
        <EachFile file={file} user={user} key={file.id} />
      ))}
    </div>
  );
}

export default Files;

function EachFile({ file, user }: { file: FilesData[number]; user: User }) {
  const client = getTgClient(user?.telegramSession as string);
  const [progress, setProgress] = useState(0);
  const [url, setURL] = useState("https://via.placeholder.com/299/199");

  useEffect(() => {
    // downloadMedia(client, user, file.id, setProgress).then((blob) =>
    //   setURL(URL.createObjectURL(blob))
    // );
  }, []);

  const router = useRouter();

  return (
    <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
      <Link
        target="_blank"
        href={file.url}
        className="absolute inset-1 z-10"
        prefetch={false}
      >
        <span className="sr-only">View file</span>
      </Link>
      {url ? (
        <Image
          src={url}
          alt={file.fileName}
          width={299}
          height={199}
          className="h-41 w-full object-cover transition-opacity group-hover:opacity-50"
        />
      ) : (
        <div>{progress}</div>
      )}

      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className="truncate font-medium">{file.fileName}</div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            {file.mimeType}
          </Badge>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          <div>Size: {formatBytes(Number(file.size))}</div>
        </div>
        <div className="absolute z-50 right-2 bottom-2">
          <UserItemActions>
            <Button
              className="w-full border-none"
              variant={"destructive"}
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                console.log(e);
                if (!user) return alert("Please login to delete files");

                await deleteFile(file.id);

                const deleteFilResult = await delelteItem(
                  user,
                  file.fileTelegramId,
                  client
                );

                successToast("You have Deleted the file successfully");
                router.refresh();
              }}
            >
              <span className="text-white text-sm text">Delete</span>
            </Button>
          </UserItemActions>
        </div>
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

"use client";
import { FilesData } from "@/app/files/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { tgClient } from "@/lib/tgClient";
import { delelteItem, formatBytes } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Api, TelegramClient } from "telegram";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type User = {
  id: string;
  name: string;
  email: string;
  telegramSession: string;
  channelId: string;
};

import { createFetchStore } from "react-suspense-fetch";

const getAllFiles = async (client: TelegramClient, user: User) => {
  const limit = 8;
  let offsetId = 0;
  let allMessages: Api.Message[] = [];
  let hasMore = true;

  try {
    console.log("Connecting to Telegram client...");

    await client.connect();

    console.log("Connection status", client.connected);

    if (!client.connected) {
      throw new Error("Client is not connected");
    }

    while (hasMore) {
      console.log(`Fetching messages with offsetId: ${offsetId}`);

      const result = await client.getMessages(user?.channelId, {
        limit: limit,
        offsetId: offsetId,
      });

      console.log(`Fetched ${result.length} messages`);

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
          title: file?.title,
          name: file?.name,
          size: formatBytes(file?.size as number),
          src: crypto.randomUUID(),
          type: file?.mimeType as string,
          id,
        } satisfies FilesData;
      });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err?.message);
    }
  }
};

const store = createFetchStore(
  async (arg: { client: TelegramClient; user: User }) => {
    return getAllFiles(arg.client, arg.user);
  }
);

function Files({ user, mimeType }: { user: User; mimeType?: string }) {
  const [allFiles, setAllFiles] = useState<FilesData[]>();
  const client = tgClient(user?.telegramSession as string);

  const router = useRouter();

  store.prefetch({ client, user });
  const result = user ? store.get({ client, user }) : undefined;

  const filesToDisplay = mimeType
    ? result?.filter(({ type }) => type.startsWith(mimeType))
    : result;

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filesToDisplay?.map((file, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md"
        >
          <Link
            target="_blank"
            href={`https://t.me/kuneDrive/${file.id}`}
            className="absolute inset-1 z-10"
            prefetch={false}
          >
            <span className="sr-only">View file</span>
          </Link>
          <Image
            src={"https://via.placeholder.com/299x199"}
            alt={file.name}
            width={299}
            height={199}
            className="h-41 w-full object-cover transition-opacity group-hover:opacity-50"
          />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between">
              <div className="truncate font-medium">{file.name}</div>
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs"
              >
                {file.type}
              </Badge>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <div>Size: {file.size}</div>
            </div>
            <div className="absolute z-50 right-2 bottom-2">
              <UserItemActions>
                <Button
                  className="w-full border-none"
                  variant={"destructive"}
                  onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                    console.log(e);
                    if (!user) return alert("Please login to delete files");
                    await delelteItem(user, file.id);
                    router.refresh();
                  }}
                >
                  <span className="text-white text-sm text">Delete</span>
                </Button>
              </UserItemActions>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Files;

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

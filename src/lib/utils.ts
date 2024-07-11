import { type ClassValue, clsx } from "clsx"
import { revalidatePath } from "next/cache";
import { twMerge } from "tailwind-merge";
import { tgClient } from "./tgClient";
import { User } from "@/components/FilesRender";
import { TelegramClient } from "telegram";
import { ChannelDetails } from "./types";
import { Dispatch, SetStateAction } from "react";
import { on } from "events";

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
  >
) {
  console.log("user", user);
  const sessionString = user?.telegramSession;
  const client = tgClient(sessionString as string);
  await client.connect();

  const files = formData.getAll("files") as File[];
  try {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const toUpload = await client.uploadFile({
        file: file,
        workers: 1,
        onProgress: (progress) => {
          onProgress({
            itemName: file.name,
            itemIndex: index,
            progress: progress,
          });
        },
      });

      const result = await client.sendFile(user?.channelId, {
        file: toUpload,
        forceDocument: true,
      });
      console.log("File uploaded successfully:", result);
      result;
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("there was an error");
  } finally {
    await client.disconnect();
  }
}

export async function delelteItem(user: User, postId: number | string) {
  const sessionString = user?.telegramSession;
  const client = tgClient(sessionString as string);
  await client.connect();

  try {
    const deleteMediaStatus = await client.deleteMessages(
      user?.channelId,
      [Number(postId)],
      {
        revoke: true,
      }
    );
    return deleteMediaStatus;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("there was an error");
  } finally {
    await client.disconnect();
  }
}

export async function getChannelDetails(
  client: TelegramClient,
  username: string
) {
  if (!client?.connected) {
    await client.connect();
  }

  const entity = (await client.getEntity(
    username
  )) as unknown as ChannelDetails & {
    id: { value: string };
    broadcast: boolean;
    creator: any;
  };

  const channelDetails: Partial<ChannelDetails> = {
    title: entity.title,
    username: entity.username,
    channelId: entity.id.value,
    isCreator: entity.creator,
    isBroadcast: entity.broadcast,
  };

  client.disconnect();
  return channelDetails;
}


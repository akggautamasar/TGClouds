import { type ClassValue, clsx } from "clsx"
import { revalidatePath } from "next/cache";
import { twMerge } from "tailwind-merge";
import { tgClient } from "./tgClient";
import { User } from "@/components/FilesRender";

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

export async function uploadFiles(formData: FormData, user: User) {
  console.log("user", user);
  const sessionString = user?.telegramSession;
  const client = tgClient(sessionString as string);
  await client.connect();

  const files = formData.getAll("files") as File[];
  try {
    for (const file of files) {
      const toUpload = await client.uploadFile({ file, workers: 1 });

      const result = await client.sendFile(user?.channelId, {
        file: toUpload,
        forceDocument: true,
      });
      console.log("File uploaded successfully:", result);
      revalidatePath("/");
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
    await client.deleteMessages(user?.channelId, [Number(postId)], {
      revoke: true,
    });
    revalidatePath("/");
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("there was an error");
  } finally {
    await client.disconnect();
  }
}
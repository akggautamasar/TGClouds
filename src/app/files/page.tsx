import { getUser } from "@/actions";
import DisplayFiles from "@/components/files";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import Files from "@/layouts/files";
import { tgClient } from "@/lib/tgClient";
import { formatBytes } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Api, TelegramClient } from "telegram";

export type FilesData = {
  title: string;
  type: string;
  size: string;
  src: string;
  name: string;
  id: string | number;
};

export const getAllFiles = async () => {
  const userClerk = await currentUser();

  if (!userClerk) return redirect("/auth/login");

  const user = await getUser(userClerk?.emailAddresses[0].emailAddress);

  let client: TelegramClient | undefined;
  const sessionString = user?.telegramSession;
  console.log("Session String:", sessionString);
  const channelId = user?.channelId;

  if (!sessionString) {
    console.log("No session string found, redirecting to login");
    return redirect("/auth/login");
  }

  if (!channelId) {
    redirect("/connect-telegram");
  }

  try {
    client = tgClient(sessionString as string);
    console.log("Connecting to Telegram client...");

    // await client.connect();

    if (!client.connected) {
      throw new Error("There was an error connecting to Telegram");
    }

    const limit = 100;
    let offsetId = 0;
    let allMessages: Api.Message[] = [];
    let hasMore = true;

    while (hasMore) {
      console.log(`Fetching messages with offsetId: ${offsetId}`);
      const result = await client.getMessages(channelId, {
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

    console.log("All messages fetched:", allMessages.length);
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
      console.error("Error:", err.message);
    }
    throw new Error("There was an error while getting Files");
  } finally {
    try {
      // await client?.disconnect();
      console.log("Disconnected from Telegram client");
    } catch (disconnectError) {
      console.error("Error disconnecting:", disconnectError);
    }
  }
};

export default async function Home() {
  // const allFiles = await getAllFiles();

  const userClerk = await currentUser();

  if (!userClerk) return redirect("/auth/login");

  const user = await getUser(userClerk?.emailAddresses[0].emailAddress);

  if (!user?.channelId || !user?.telegramSession) {
    return redirect("/connect-telegram");
  }

  return (
    <DisplayFiles>
      {/* @ts-ignore */}
      <Files user={user} />
    </DisplayFiles>
  );
}

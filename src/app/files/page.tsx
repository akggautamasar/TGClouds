import DisplayFiles from '@/components/files';
import Files from "@/layouts/files";
import { tgClient } from "@/lib/tgClient";
import { formatBytes } from '@/lib/utils';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { Api, TelegramClient } from "telegram";
import { TotalList } from "telegram/Helpers";

export type FilesData = {
  title: string;
  type: string;
  size: string;
  src: string;
  name: string;
  id: string | number;
};



export const getAllFiles = async (channelUsername: string) => {


  let client: TelegramClient | undefined;
  const sessionString = cookies().get("tgSession");
  console.log('Session String:', sessionString);

  if (!sessionString) {
    console.log('No session string found, redirecting to login');
    return redirect('/auth/login');
  }

  try {
    client = tgClient(sessionString.value as string);
    console.log('Connecting to Telegram client...');

    const isConnected = await client.connect();
    console.log('Is connected:', isConnected);

    if (!isConnected) {
      throw new Error('There was an error connecting to Telegram');
    }



    const limit = 100;
    let offsetId = 0;
    let allMessages: Api.Message[] = [];
    let hasMore = true;

    while (hasMore) {
      console.log(`Fetching messages with offsetId: ${offsetId}`);
      const result = await client.getMessages(channelUsername, {
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

    console.log('All messages fetched:', allMessages.length);
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
      console.error('Error:', err.message);
      throw new Error(err.message);
    }
    console.error('Unknown error occurred while getting messages');
    throw new Error("There was an error while getting messages");
  } finally {
    try {
      // await client?.disconnect();
      console.log('Disconnected from Telegram client');
    } catch (disconnectError) {
      console.error('Error disconnecting:', disconnectError);
    }
  }
};



export default async function Home() {
  const allFiles = await getAllFiles('kuneDrive')

  return (
    <DisplayFiles>
      <Files files={allFiles} />
    </DisplayFiles>
  );
}

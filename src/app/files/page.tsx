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
  bufferString: string;
  id: string | number;
};

export const getAllFiles = async (channelUsername: string) => {
  let client: TelegramClient | undefined;
  const sessionString = cookies().get("tgSession");
  console.log(sessionString)
  if (!sessionString) return redirect('/login')
  try {

    client = tgClient(sessionString?.value as string);
    const isConnected = await client.connect()

    if (!isConnected) throw Error('there was an error connecting telegram')
    const limit = 100;
    let offsetId = 0;

    let allMessages: TotalList<Api.Message> = [];
    let hasMore = true;

    while (hasMore) {
      const result = await client.getMessages(channelUsername, {
        limit: limit,
        offsetId: offsetId,
      });

      allMessages = allMessages.concat(result);
      if (result.length < limit) {
        hasMore = false;
      } else {
        offsetId = result[result.length - 1].id;
      }
    }
    return allMessages
      .filter((messges) => messges.file)
      .map(({ file, id }) => {
        //@ts-ignore
        const bufferString = JSON.stringify(file?.media?.fileReference);
        return {
          title: file?.title,
          name: file?.name,
          size: formatBytes(file?.size as number),
          src: crypto.randomUUID(),
          type: file?.mimeType as string,
          bufferString,
          id,
        } satisfies FilesData;
      });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("There Was an Error While getting Messages");
  } finally {
    // client?.disconnect();
  }
};

export default async function Home() {
  const allFiles = await getAllFiles("kuneDrive")

  return (
    <DisplayFiles>
      <Files files={allFiles} />
    </DisplayFiles>
  );
}

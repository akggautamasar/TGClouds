import DisplayFiles from '@/components/files';
import Files from "@/layouts/files";
import { tgClient } from "@/lib/tgClient";
import { formatBytes } from '@/lib/utils';
import { cookies } from "next/headers";
import { Api, TelegramClient } from "telegram";
import { TotalList } from "telegram/Helpers";
export type FilesData =  {
    title: string;
    type: string;
    size: string;
    src: string;
    name:string,
    buffer:Buffer | null
    id:string | number
}


export const getAllFiles = async (channelUsername: string) => {
    const sessionString = cookies().get('tgSession')
    const client = tgClient(sessionString?.value as string)
    await client.connect()
    const limit = 100; 
    let offsetId = 0; 

    let allMessages: TotalList<Api.Message> = [];
    let hasMore = true;

    while (hasMore) {
        const result = await client.getMessages(channelUsername, {
            limit: limit,
            offsetId: offsetId
        });

        allMessages = allMessages.concat(result);
        if (result.length < limit) {
            hasMore = false;
        } else {
            offsetId = result[result.length - 1].id;
        }
    }
    client.disconnect()
    return allMessages.filter((messges) => messges.file).map(({file, id}) => {
        //@ts-ignore
      const buffer = file?.media?.fileReference as Buffer | null
      return {title : file?.title, name:file?.name, size : formatBytes(file?.size as number), src : crypto.randomUUID(), type:file?.mimeType as string, buffer, id} satisfies FilesData
    })
};

export default async function Home() {
  const  allFiles = await getAllFiles("kuneDrive")

    return (
        <DisplayFiles>
            <Files files={allFiles} />
        </DisplayFiles>
    );
}

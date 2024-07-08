import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";
import { Api, TelegramClient } from "telegram";
import { TotalList } from "telegram/Helpers";
import { cookies } from "next/headers";
import { tgClient } from "@/lib/tgClient";
import { string } from "zod";
const filesData = [
    {
        title: "Image 0.jpg",
        type: "JPG",
        size: "1.3 MB",
        modified: "2022-05-12",
        src: "/placeholder.svg",
    },
    {
        title: "Video 0.mp4",
        type: "MP4",
        size: "44.6 MB",
        modified: "2022-04-28",
        src: "/placeholder.svg",
    },
    {
        title: "Document 0.pdf",
        type: "PDF",
        size: "4.1 MB",
        modified: "2022-03-15",
        src: "/placeholder.svg",
    },
    {
        title: "Audio 0.mp3",
        type: "MP3",
        size: "11.8 MB",
        modified: "2022-02-22",
        src: "/placeholder.svg",
    },
    {
        title: "Folder 0",
        type: "Folder",
        size: "124.3 MB",
        modified: "2022-01-18",
        src: "/placeholder.svg",
    },
    {
        title: "Image 1.jpg",
        type: "JPG",
        size: "2.1 MB",
        modified: "2022-06-01",
        src: "/placeholder.svg",
    },
    {
        title: "Video 1.mp4",
        type: "MP4",
        size: "64.2 MB",
        modified: "2022-05-20",
        src: "/placeholder.svg",
    },
    {
        title: "Document 1.pdf",
        type: "PDF",
        size: "6.8 MB",
        modified: "2022-04-10",
        src: "/placeholder.svg",
    },
];


const getAllMessages = async (client: TelegramClient, channelUsername: string) => {
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

    return allMessages;
};



export default async function Home() {
    const sessionString = cookies().get('tgSession')
    const client = tgClient(sessionString?.value as string)

  const  allMessages = await getAllMessages(client, "kuneDrive")
    
  const files = allMessages.filter((messges) => messges.file).map(({file}) => {
    return {title : file?.title, size : String(file?.size), src : crypto.randomUUID(), modified : new Date().toLocaleString(), type:file?.mimeType as string} satisfies typeof filesData[0]
  })


    return (
        <DisplayFiles>
            <Files files={files} />
        </DisplayFiles>
    );
}

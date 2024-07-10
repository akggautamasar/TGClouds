import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";
import { getAllFiles } from "../page";

export default async function Home() {
    const videosData = (await getAllFiles()).filter(({ type }) => type.startsWith('video/'))
    return (
        <DisplayFiles>
            <Files files={videosData} />
        </DisplayFiles>
    );
}
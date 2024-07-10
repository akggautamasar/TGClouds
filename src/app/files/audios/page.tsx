import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";
import { getAllFiles } from "../page";

export default async function Home() {
  const audioFiles = (await getAllFiles()).filter(({ type }) => type.startsWith('audio/'))

  return (
    <DisplayFiles>
      <Files files={audioFiles} />
    </DisplayFiles>
  );
}
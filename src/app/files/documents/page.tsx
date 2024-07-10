import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";
import { getAllFiles } from "../page";
export default async function Home() {
    const documentsData =  (await getAllFiles()).filter(({type}) => type.startsWith('application/'))

  return (
      <DisplayFiles>
        <Files files={documentsData}/>
      </DisplayFiles>
  );
}
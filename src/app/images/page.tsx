import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";
import { getAllFiles } from "../page";
export default async function Home() {
  const imageFiles =  (await getAllFiles('kuneDrive')).filter(({type}) => type.startsWith('image/'))
  return (
      <DisplayFiles>
        <Files files={imageFiles}/>
      </DisplayFiles>
  );
}
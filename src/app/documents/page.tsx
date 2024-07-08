import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";


const documentsData = [
    {
        title: "Document 0.pdf",
        type: "PDF",
        size: "4.1 MB",
        modified: "2022-03-15",
        src: "https://via.placeholder.com/299x199?text=Document+0",
    },
    {
        title: "Document 1.docx",
        type: "DOCX",
        size: "1.8 MB",
        modified: "2022-04-10",
        src: "https://via.placeholder.com/299x199?text=Document+1",
    },
    {
        title: "Document 2.txt",
        type: "TXT",
        size: "0.7 MB",
        modified: "2022-05-14",
        src: "https://via.placeholder.com/299x199?text=Document+2",
    },
    {
        title: "Document 3.pptx",
        type: "PPTX",
        size: "8.5 MB",
        modified: "2022-06-20",
        src: "https://via.placeholder.com/299x199?text=Document+3",
    },
];
export default function Home() {
  return (
      <DisplayFiles>
        <Files files={documentsData}/>
      </DisplayFiles>
  );
}
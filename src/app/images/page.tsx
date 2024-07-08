import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";



const imagesData = [
  {
      title: "Image 0.jpg",
      type: "JPG",
      size: "1.3 MB",
      modified: "2022-05-12",
      src: "https://via.placeholder.com/299x199?text=Image+0",
  },
  {
      title: "Image 1.jpg",
      type: "JPG",
      size: "2.1 MB",
      modified: "2022-06-01",
      src: "https://via.placeholder.com/299x199?text=Image+1",
  },
  {
      title: "Image 2.png",
      type: "PNG",
      size: "3.5 MB",
      modified: "2022-07-15",
      src: "https://via.placeholder.com/299x199?text=Image+2",
  },
  {
      title: "Image 3.gif",
      type: "GIF",
      size: "2.8 MB",
      modified: "2022-08-10",
      src: "https://via.placeholder.com/299x199?text=Image+3",
  },
];
export default function Home() {
  return (
      <DisplayFiles>
        <Files files={imagesData}/>
      </DisplayFiles>
  );
}
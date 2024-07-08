import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";
const videosData = [
    {
        title: "Video 0.mp4",
        type: "MP4",
        size: "44.6 MB",
        modified: "2022-04-28",
        src: "https://via.placeholder.com/299x199?text=Video+0",
    },
    {
        title: "Video 1.mp4",
        type: "MP4",
        size: "64.2 MB",
        modified: "2022-05-20",
        src: "https://via.placeholder.com/299x199?text=Video+1",
    },
    {
        title: "Video 2.avi",
        type: "AVI",
        size: "75.1 MB",
        modified: "2022-06-05",
        src: "https://via.placeholder.com/299x199?text=Video+2",
    },
    {
        title: "Video 3.mkv",
        type: "MKV",
        size: "85.3 MB",
        modified: "2022-07-18",
        src: "https://via.placeholder.com/299x199?text=Video+3",
    },
];
export default function Home() {
  return (
      <DisplayFiles>
        <Files files={videosData}/>
      </DisplayFiles>
  );
}
import Image from "next/image";
import DisplayFiles from '@/components/files'
import Files from "@/layouts/files";



const audiosData = [
    {
        title: "Audio 0.mp3",
        type: "MP3",
        size: "11.8 MB",
        modified: "2022-02-22",
        src: "https://via.placeholder.com/299x199?text=Audio+0",
    },
    {
        title: "Audio 1.wav",
        type: "WAV",
        size: "22.4 MB",
        modified: "2022-03-15",
        src: "https://via.placeholder.com/299x199?text=Audio+1",
    },
    {
        title: "Audio 2.flac",
        type: "FLAC",
        size: "33.7 MB",
        modified: "2022-04-18",
        src: "https://via.placeholder.com/299x199?text=Audio+2",
    },
    {
        title: "Audio 3.aac",
        type: "AAC",
        size: "14.2 MB",
        modified: "2022-05-21",
        src: "https://via.placeholder.com/299x199?text=Audio+3",
    },
];


export default function Home() {
  return (
      <DisplayFiles>
        <Files files={audiosData}/>
      </DisplayFiles>
  );
}
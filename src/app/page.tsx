import Image from "next/image";
import Files from '../components/ui/files'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Files />
    </main>
  );
}

import DisplayFiles from "@/components/files";
import { useUserPotected } from "../page";
import Files from "@/components/FilesRender";

export default async function Home() {
  const user = await useUserPotected();

  return (
    <DisplayFiles>
      <Files user={user} mimeType="video" />
    </DisplayFiles>
  );
}

import DisplayFiles from "@/components/files";
import { useUserPotected } from "../page";
import Files from "@/components/FilesRender";
import { Suspense } from "react";
export default async function Home() {
  const user = await useUserPotected();

  return (
    <DisplayFiles>
      <Suspense fallback={"please wait "}>
        <Files user={user} mimeType="application/" />
      </Suspense>
    </DisplayFiles>
  );
}

import { Dashboard } from "@/components/dashboard";
import Files from "@/components/FilesRender";
import { LoadingItems } from "@/components/loading-files";
import { Suspense } from "react";
import { useUserPotected } from "../page";

export default async function Home() {
  const user = await useUserPotected();

  return (
    <Dashboard user={user}>
      <Suspense fallback={<LoadingItems />}>
        <Files user={user} mimeType="audio/" />
      </Suspense>
    </Dashboard>
  );
}

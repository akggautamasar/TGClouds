import { useUserProtected } from "@/actions";
import { Dashboard } from "@/components/dashboard";
import Files from "@/components/FilesRender";
import { LoadingItems } from "@/components/loading-files";
import { Suspense } from "react";

export default async function Home() {
  const user = await useUserProtected();
  return (
    <Dashboard user={user}>
      <Suspense fallback={<LoadingItems />}>
        <Files user={user} mimeType="image/" />
      </Suspense>
    </Dashboard>
  );
}

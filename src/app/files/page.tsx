import { useUserProtected } from "@/actions";
import { Dashboard } from "@/components/dashboard";
import Files from "@/components/FilesRender";
import { LoadingItems } from "@/components/loading-files";
import { Suspense } from "react";




export type FilesData = {
  title: string;
  type: string;
  size: string;
  src: string;
  name: string;
  id: string | number;
};



export default async function Home() {
  const user = await useUserProtected();

  return (
    <Dashboard user={user}>
      <Suspense fallback={<LoadingItems />}>
        <Files user={user} />
      </Suspense>
    </Dashboard>
  );
}

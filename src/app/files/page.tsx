import { getAllFiles, useUserProtected } from "@/actions";
import { Dashboard } from "@/components/dashboard";
import Files from "@/components/FilesRender";
import { LoadingItems } from "@/components/loading-files";
import { Suspense } from "react";
import { TypeOf } from "zod";




export type FilesData = {
  title: string;
  type: string;
  size: string;
  src: string;
  name: string;
  id: string | number;
};


export type FilesTwo = Awaited<ReturnType<typeof getAllFiles>>




export default async function Home() {
  const user = await useUserProtected();

  const files = await getAllFiles()

  return (
    <Dashboard user={user}>
      <Suspense fallback={<LoadingItems />}>
        <Files Files={files} user={user} />
      </Suspense>
    </Dashboard>
  );
}

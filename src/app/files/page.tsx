import { getAllFiles, useUserProtected } from "@/actions";
import { Dashboard } from "@/components/dashboard";
import Files from "@/components/FilesRender";
import { LoadingItems } from "@/components/loading-files";
import { Suspense } from "react";

export type FilesData = Awaited<ReturnType<typeof getAllFiles>>;

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const user = await useUserProtected();

  const searchItem = searchParams.search;
  const page = parseInt(searchParams.page || "1");

  const files = await getAllFiles(searchItem, (page - 1) * 8);

  return (
    <Dashboard user={user}>
      <Suspense fallback={<LoadingItems />}>
        <Files files={files} user={user} />
      </Suspense>
    </Dashboard>
  );
}

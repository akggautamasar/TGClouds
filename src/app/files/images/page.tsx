import { getFilesFromSpecificType, useUserProtected } from "@/actions";
import { Dashboard } from "@/components/dashboard";
import Files from "@/components/FilesRender";
import { LoadingItems } from "@/components/loading-files";
import { Suspense } from "react";
export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const user = await useUserProtected();

  const page = parseInt(searchParams.page || "1");

  const searchItem = searchParams.search;
  //@ts-ignore
  const [files, total] = await getFilesFromSpecificType({
    fileType: "image",
    searchItem,
    offset: (page - 1) * 8,
  });
  return (
    <Dashboard total={total} user={user}>
      <Suspense fallback={<LoadingItems />}>
        <Files files={files} user={user} />
      </Suspense>
    </Dashboard>
  );
}

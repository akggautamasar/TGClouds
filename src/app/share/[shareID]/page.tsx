import { getSharedFiles } from "@/actions";
import SharedFIle from "./SharedFIle";

export default async function Component({
  params: { shareID },
}: {
  params: { shareID: string };
}) {
  const sharedFIle = await getSharedFiles(shareID);
  return (
    <div>
      <SharedFIle
        fileID={sharedFIle?.[0].sharedFiles.fileId}
        user={sharedFIle[0].usersTable}
      />
    </div>
  );
}

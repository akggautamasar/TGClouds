import { getSharedFiles } from "@/actions";
import SharedFIle from "./SharedFIle";

export default async function Component({
  params: { shareID },
}: {
  params: { shareID: string };
}) {
  const file = await getSharedFiles(shareID);

  const fileID = file?.[0].sharedFiles.fileId;
  const user = file?.[0].usersTable;

  if (!fileID) {
    return <div>fialed to get file id that you are looking for</div>;
  }

  if (!user) {
    return <div>failed to get user that shard the file</div>;
  }

  return (
    <div>
      <SharedFIle fileID={fileID} user={user} />
    </div>
  );
}

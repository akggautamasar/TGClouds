import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "./ui/dialog";
import { UploadFiles } from "./upload-files";
import { useUserProtected } from "@/actions";

export default async function Upload() {
  const user = await useUserProtected();
  return (
    <Dialog>
      <DialogTrigger>Upload</DialogTrigger>
      <DialogContent className="min-w-[600px] max-h-[700px] overflow-auto min-h-[600px]">
        <UploadFiles user={user} />
      </DialogContent>
    </Dialog>
  );
}

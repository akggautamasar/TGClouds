'use client'
import { getUser } from "@/actions";
import { Button } from "@/components/ui/button";
import { uploadFiles } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { User } from "./FilesRender";
import { CloudUploadIcon, FileIcon, TrashIcon, UploadIcon, XIcon } from "./Icons/icons";

export function UploadFiles() {
  const [files, setFiles] = useState<{ file: File; id: string }[]>([]);

  const { isLoaded, isSignedIn, user: clerUser } = useUser();

  return (
    <div className="grid gap-6 max-w-xl mx-auto">
      <form
        action={async (formData) => {
          if (!isSignedIn) redirect("/auth");
          const email = clerUser?.emailAddresses?.[0].emailAddress;
          const user = await getUser(email);
          if (!user?.telegramSession || !user.channelId)
            return redirect("/connect-telegram");

          uploadFiles(formData, user as User);
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 border-2 border-dashed rounded-lg border-primary hover:border-primary-foreground transition-colors">
          <CloudUploadIcon className="w-10 h-10 text-primary" />
          <h3 className="text-2xl font-bold">Upload Files</h3>
          <p className="text-muted-foreground">
            Drag and drop files here or click to sFilesDataelect
          </p>

          <input
            onChange={(e) => {
              if (e.currentTarget.files) {
                const files: { file: File; id: string }[] = [];
                for (const file of e?.currentTarget?.files) {
                  files.push({ id: crypto.randomUUID(), file });
                }
                setFiles(files);
              }
            }}
            type="file"
            multiple
            name="files"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 w-full"
          />
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <h4 className="text-lg font-medium">Uploaded Files</h4>
            <Button type="button" variant="outline">
              <TrashIcon className="w-2 h-2 mr-2 p-1" />
              Clear All
            </Button>
          </div>
          <div className="grid gap-2">
            {files.map(({ file, id }) => {
              return (
                <div
                  key={id}
                  className="flex items-center justify-between bg-muted p-4 rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <FileIcon className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {file.size}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      const filetedItems = files.filter(
                        (file) => file.id !== id
                      );
                      setFiles(filetedItems);
                    }}
                    variant="ghost"
                    size="icon"
                  >
                    <XIcon className="w-4 h-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <UploadButton />
      </form>
    </div>
  );
}

function UploadButton() {
  const status = useFormStatus();

  return (
    <Button disabled={status.pending} type="submit" className="justify-center">
      <UploadIcon className="w-4 h-4 mr-2" />
      {status.pending ? "please wait ..." : "Upload Files"}
    </Button>
  );
}



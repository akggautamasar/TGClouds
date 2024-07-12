'use client'
import { Button } from "@/components/ui/button";
import { getTgClient } from "@/lib/getTgClient";
import { uploadFiles } from "@/lib/utils";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  CloudUploadIcon,
  FileIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
} from "./Icons/icons";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { User } from "./FilesRender";
import { Progress } from "./ui/progress";

export function UploadFiles({ user }: { user: User }) {
  const [files, setFiles] = useState<{ file: File; id: string }[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  const [uploadProgress, setUploadProgress] = useState<{
    itemName: string;
    itemIndex: number;
    progress: number;
  }>();

  return (
    <>
      <div>
        {uploadProgress && (
          <div className="flex justify-between items-center flex-col p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="font-medium text-gray-700">Upload Progress</div>
            <div>
              <div className="text-gray-600">{uploadProgress?.itemName}</div>
            </div>
            <div className="text-gray-600">
              {uploadProgress?.itemIndex! + 1}/{files.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <Progress value={Math.round(uploadProgress.progress)} className="w-full" />
            </div>
            <div className="ml-2 text-gray-600">
              {uploadProgress?.progress * 100}%
            </div>
          </div>
        )}
      </div>
      <div className="grid gap-6 max-w-xl mx-auto">
        <form
          action={async (formData) => {
            if (!user?.telegramSession || !user.channelUsername)
              return router.replace("/connect-telegram");

            const fileUploadResult = await uploadFiles(
              formData,
              user as User,
              setUploadProgress,
              getTgClient(user?.telegramSession as string)
            );
            toast({
              title: `You have successfully uploaded ${files.length} files  `,
              duration: 5000,
              description: "you can see them in the files tab",
            });
            router.refresh();
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
            <div className="grid gap-2 my-3">
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
    </>
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



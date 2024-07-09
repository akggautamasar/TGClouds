'use client'
import { uploadFiles } from "@/actions";
import { Button } from "@/components/ui/button"
import { useRef, useState, useActionState } from "react"
import { useFormStatus } from "react-dom";

export function UploadFiles() {
  const [files, setFiles] = useState<{ file: File, id: string }[]>([])

  return (
    <div className="grid gap-6 max-w-xl mx-auto">
      <form action={uploadFiles}>
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 border-2 border-dashed rounded-lg border-primary hover:border-primary-foreground transition-colors">
          <CloudUploadIcon className="w-10 h-10 text-primary" />
          <h3 className="text-2xl font-bold">Upload Files</h3>
          <p className="text-muted-foreground">Drag and drop files here or click to sFilesDataelect</p>

          <input
            onChange={e => {

              if (e.currentTarget.files) {
                const files: { file: File, id: string }[] = []
                for (const file of e?.currentTarget?.files) {
                  files.push({ id: crypto.randomUUID(), file })
                }
                setFiles(files)
              }
            }
            }
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
              <TrashIcon className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
          <div className="grid gap-2">
            {files.map(({ file, id }) => {
              return <div key={id} className="flex items-center justify-between bg-muted p-4 rounded-md">
                <div className="flex items-center gap-4">
                  <FileIcon className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-muted-foreground">{file.size}</div>
                  </div>
                </div>
                <Button type="button" onClick={() => {
                  const filetedItems = files.filter((file) => file.id !== id)
                  setFiles(filetedItems)
                }} variant="ghost" size="icon">
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            })}

          </div>
        </div>
        <UploadButton />
      </form>
    </div>
  )
}


function UploadButton() {
  const status = useFormStatus();

  return <Button disabled={status.pending} type="submit" className="justify-center">
    <UploadIcon className="w-4 h-4 mr-2" />
    {status.pending ? "please wait ..." : "Upload Files"}
  </Button>
}

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}


function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}


function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}


function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

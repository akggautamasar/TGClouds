import Link from "next/link";
import React from "react";
import {
  CloudIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  Music2Icon,
  VideoIcon,
} from "./Icons/icons";
import { UserButton } from "@clerk/nextjs";
import UserTelegramDetails from "./UserTelegramDetails";
import { useUserPotected } from "@/app/files/page";

async function Sidebar() {
  const user = await useUserPotected();

  return (
    <div className="flex flex-col border-r bg-muted/40 px-4 py-6">
      <Link
        href="/files"
        className="flex items-center gap-2 font-semibold"
        prefetch={false}
      >
        <CloudIcon className="h-6 w-6" />
        <span>TG Cloud</span>
      </Link>
      <nav className="mt-8 flex flex-col gap-4">
        <Link
          href="/files/images"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-colors hover:bg-muted"
          prefetch={false}
        >
          <ImageIcon className="h-5 w-5" />
          Images
        </Link>
        <Link
          href="/files/videos"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
          prefetch={false}
        >
          <VideoIcon className="h-5 w-5" />
          Videos
        </Link>
        <Link
          href="/files/documents"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
          prefetch={false}
        >
          <FileTextIcon className="h-5 w-5" />
          Documents
        </Link>
        <Link
          href="/files/audios"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
          prefetch={false}
        >
          <Music2Icon className="h-5 w-5" />
          Audio
        </Link>
        <Link
          href="/files/folders"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
          prefetch={false}
        >
          <FolderIcon className="h-5 w-5" />
          Folders
        </Link>
      </nav>
      <div className="mt-auto flex items-center flex-col gap-2">
        <div>
          <UserTelegramDetails user={user} />
        </div>
        <div>
          <UserButton showName={true} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

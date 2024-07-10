import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ModeToggle } from "./darkmodeToggle";
import { UploadFiles } from "./upload-files";
import {
  CloudIcon,
  FileTextIcon,
  FilterIcon,
  FolderIcon,
  ImageIcon,
  Music2Icon,
  SearchIcon,
  UploadIcon,
  VideoIcon,
} from "./Icons/icons";

export default async function DisplayFiles({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full grid-cols-[240px_1fr] bg-background">
      <div className="flex flex-col border-r bg-muted/40 px-4 py-6">
        <Link
          href="/"
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
        <div className="mt-auto flex items-center gap-2">
          <UserButton showName={true} />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="w-full rounded-lg bg-muted pl-8"
            />
          </div>
          <div>
            <ModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="name">
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="type">Type</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="h-8 gap-1 flex border-gray-400 items-center justify-center">
            <UploadIcon className="h-4 w-4" />
            {/* @ts-ignore */}
            <Upload>Upload</Upload>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}



function Upload() {
  return (
    <Dialog>
      <DialogTrigger>Upload</DialogTrigger>
      <DialogContent className="min-w-[600px] max-h-[700px] overflow-auto min-h-[600px]">
        <UploadFiles />
      </DialogContent>
    </Dialog>
  );
}

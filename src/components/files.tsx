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
import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ModeToggle } from "./darkmodeToggle";
import { FilterIcon, SearchIcon, UploadIcon } from "./Icons/icons";
import Sidebar from "./Sidebar";
import { UploadFiles } from "./upload-files";

export default async function DisplayFiles({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full grid-cols-[240px_1fr] bg-background">
      <Sidebar />
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

import { File, Menu, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import React, { Suspense } from "react";
import { ModeToggle } from "./darkmodeToggle";
import { User } from "./FilesRender";
import {
  CloudIcon,
  FileTextIcon,
  FilterIcon,
  ImageIcon,
  Music2Icon,
  UploadIcon,
  VideoIcon,
} from "./Icons/icons";
import Upload from "./uploadWrapper";
import UserTelegramDetails from "./UserTelegramDetails";

export function Dashboard({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  return (
    <div className="grid min-h-screen relative w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden sticky top-0 overflow-y-hidden border-r bg-muted/40 md:block">
        <div className="flex  h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <CloudIcon className="h-6 w-6" />
              <span>TG Cloud</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/files"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <File className="h-5 w-5" />
                All files
              </Link>
              <Link
                href="/files/images"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ImageIcon className="h-5 w-5" />
                Images
              </Link>
              <Link
                href="/files/videos"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                {" "}
                <VideoIcon className="h-5 w-5" />
                Videos
              </Link>
              <Link
                href="/files/documents"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileTextIcon className="h-5 w-5" />
                Documents
              </Link>
              <Link
                href="/files/audios"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Music2Icon className="h-5 w-5" />
                Audio
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <div className="mt-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Channel</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button size="sm" className="w-full">
                    <Link
                      target="_blank"
                      href={"https://t.me/" + user.channelId}
                      className="text-muted-foreground font-bold no-underline"
                    >
                      View in Telegram
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-auto p-2">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <CloudIcon className="h-6 w-6" />
                  <span>TG Cloud</span>
                </Link>
                <Link
                  href="/"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <File className="h-5 w-5" />
                  All files
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <ImageIcon className="h-5 w-5" />
                  Images
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <VideoIcon className="h-5 w-5" />
                  Videos
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <FileTextIcon className="h-5 w-5" />
                  Documents
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Music2Icon className="h-5 w-5" />
                  Audio
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Channel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      <Link
                        target="_blank"
                        href={"https://t.me/" + user.channelId}
                        className="text-muted-foreground font-bold no-underline"
                      >
                        View in Telegram
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
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
          <div>
            <UserButton />
          </div>
        </header>
        <main className="flex md:max-h-svh md:overflow-y-auto flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

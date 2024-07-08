import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Files() {
  return (
    <div className="grid min-h-screen w-full grid-cols-[240px_1fr] bg-background">
      <div className="flex flex-col border-r bg-muted/40 px-4 py-6">
        <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <CloudIcon className="h-6 w-6" />
          <span>Cloud Storage</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-4">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-colors hover:bg-muted"
            prefetch={false}
          >
            <ImageIcon className="h-5 w-5" />
            Images
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
            prefetch={false}
          >
            <VideoIcon className="h-5 w-5" />
            Videos
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
            prefetch={false}
          >
            <FileTextIcon className="h-5 w-5" />
            Documents
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
            prefetch={false}
          >
            <Music2Icon className="h-5 w-5" />
            Audio
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
            prefetch={false}
          >
            <FolderIcon className="h-5 w-5" />
            Folders
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-sm">
            <div className="font-medium">John Doe</div>
            <div className="text-muted-foreground">john@example.com</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search files..." className="w-full rounded-lg bg-muted pl-8" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
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
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <UploadIcon className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Upload</span>
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View file</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt="File thumbnail"
                width={300}
                height={200}
                className="h-40 w-full object-cover transition-opacity group-hover:opacity-50"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">Image 1.jpg</div>
                  <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                    JPG
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Size: 2.3 MB</div>
                  <div>Modified: 2023-05-12</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View file</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt="File thumbnail"
                width={300}
                height={200}
                className="h-40 w-full object-cover transition-opacity group-hover:opacity-50"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">Video 1.mp4</div>
                  <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                    MP4
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Size: 45.6 MB</div>
                  <div>Modified: 2023-04-28</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View file</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt="File thumbnail"
                width={300}
                height={200}
                className="h-40 w-full object-cover transition-opacity group-hover:opacity-50"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">Document 1.pdf</div>
                  <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                    PDF
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Size: 5.1 MB</div>
                  <div>Modified: 2023-03-15</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View file</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt="File thumbnail"
                width={300}
                height={200}
                className="h-40 w-full object-cover transition-opacity group-hover:opacity-50"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">Audio 1.mp3</div>
                  <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                    MP3
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Size: 12.8 MB</div>
                  <div>Modified: 2023-02-22</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View file</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt="File thumbnail"
                width={300}
                height={200}
                className="h-40 w-full object-cover transition-opacity group-hover:opacity-50"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">Folder 1</div>
                  <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                    Folder
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Size: 125.3 MB</div>
                  <div>Modified: 2023-01-18</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View file</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt="File thumbnail"
                width={300}
                height={200}
                className="h-40 w-full object-cover transition-opacity group-hover:opacity-50"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">Image 2.jpg</div>
                  <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                    JPG
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Size: 3.1 MB</div>
                  <div>Modified: 2023-06-01</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View file</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt="File thumbnail"
                width={300}
                height={200}
                className="h-40 w-full object-cover transition-opacity group-hover:opacity-50"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">Video 2.mp4</div>
                  <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                    MP4
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Size: 65.2 MB</div>
                  <div>Modified: 2023-05-20</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View file</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt="File thumbnail"
                width={300}
                height={200}
                className="h-40 w-full object-cover transition-opacity group-hover:opacity-50"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">Document 2.pdf</div>
                  <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
                    PDF
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Size: 7.8 MB</div>
                  <div>Modified: 2023-04-10</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function CloudIcon(props) {
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
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}


function FileTextIcon(props) {
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
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}


function FilterIcon(props) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}


function FolderIcon(props) {
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
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}


function ImageIcon(props) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}


function Music2Icon(props) {
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
      <circle cx="8" cy="18" r="4" />
      <path d="M12 18V2l7 4" />
    </svg>
  )
}


function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function UploadIcon(props) {
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


function VideoIcon(props) {
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
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}

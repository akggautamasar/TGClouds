import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"




type FilesProp = {
    title: string;
    type: string;
    size: string;
    modified: string;
    src: string;
}[]

function Files({files} : {files :FilesProp }) {
    return (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file, index) => (
                <Card key={index} className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
                    <Link href="#" className="absolute inset-1 z-10" prefetch={false}>
                        <span className="sr-only">View file</span>
                    </Link>
                    <img
                        src={file.src}
                        alt="File thumbnail"
                        width={299}
                        height={199}
                        className="h-41 w-full object-cover transition-opacity group-hover:opacity-50"
                    />
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="truncate font-medium">{file.title}</div>
                            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                                {file.type}
                            </Badge>
                        </div>
                        <div className="mt-3 text-sm text-muted-foreground">
                            <div>Size: {file.size}</div>
                            <div>Modified: {file.modified}</div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default Files;

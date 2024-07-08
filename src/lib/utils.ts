import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes : number) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes < KB) {
      return `${bytes} Bytes`;
  } else if (bytes < MB) {
      return `${(bytes / KB).toFixed(2)} KB`;
  } else if (bytes < GB) {
      return `${(bytes / MB).toFixed(2)} MB`;
  } else {
      return `${(bytes / GB).toFixed(2)} GB`;
  }
}
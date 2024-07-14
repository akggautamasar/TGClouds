"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function CustomLInk({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href: string;
} & React.ComponentPropsWithoutRef<typeof Link>) {
  const router = useRouter();
  useEffect(() => {
    router.prefetch(href);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href]);

  return (
    <Link {...props} href={href}>
      {children}
    </Link>
  );
}

export default CustomLInk;

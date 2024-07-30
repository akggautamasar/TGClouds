"use client";

import { User } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { downloadMedia } from "@/lib/utils";

function SharedFIle({ user, fileID }: { user: User; fileID: string }) {
  const [url, setURL] = useState("");

  useEffect(() => {
    downloadMedia({
      //@ts-ignore
      user,
      messageId: fileID,
      //@ts-ignore

      category: "image",
      //@ts-ignore

      size: "large",
      //@ts-ignore

      setURL: "setURL",
    });

    return () => {
      URL.revokeObjectURL(url as string);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <img src={url} alt="fafjalj" />
    </div>
  );
}

export default SharedFIle;

"use client";

import { ChannelDetails } from "@/lib/types";
import React, { useEffect } from "react";
import { User } from "./FilesRender";
import { tgClient } from "@/lib/tgClient";
import { getChannelDetails } from "@/lib/utils";
import Link from "next/link";

function UserTelegramDetails({ user }: { user: User }) {
  const [telegramChannel, setTelegramChannel] =
    React.useState<Partial<ChannelDetails> | null>(null);

  useEffect(() => {
    const client = tgClient(user.telegramSession);
    (async () => {
      try {
        const channelDetails = await getChannelDetails(client, user.channelId);
        console.log("channelDetails", channelDetails);
        setTelegramChannel(channelDetails);
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {
      client?.disconnect();
    };
  }, [user.channelId, user.telegramSession]);

  console.log(telegramChannel);

  if (!telegramChannel) return <div>.....</div>;

  return (
    <div className="p-4 bg-white dark:bg-black text-black dark:text-white rounded-lg">
      <div className="text-lg font-bold mb-2">{telegramChannel.title}</div>
      <div>
        <Link
          target="_blank"
          href={"https://t.me/" + telegramChannel.username}
          className="text-red-500 font-bold no-underline"
        >
          {telegramChannel.username}
        </Link>
      </div>
    </div>
  );
}

export default UserTelegramDetails;

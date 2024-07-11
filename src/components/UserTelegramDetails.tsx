"use client";

import { ChannelDetails } from "@/lib/types";
import React, { cache, use, useEffect } from "react";
import { User } from "./FilesRender";
import { tgClient } from "@/lib/tgClient";
import { getChannelDetails } from "@/lib/utils";
import Link from "next/link";

const getChannelDetailsCached = cache(getChannelDetails);

function UserTelegramDetails({ user }: { user: User }) {
  const client = tgClient(user.telegramSession);

  const telegramChannel = use(getChannelDetailsCached(client, user.channelId));

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

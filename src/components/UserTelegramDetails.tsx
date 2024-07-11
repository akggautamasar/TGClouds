"use client";

import { getTgClient } from "@/lib/getTgClient";
import { getChannelDetails } from "@/lib/utils";
import Link from "next/link";
import { cache, use } from "react";
import { User } from "./FilesRender";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const getChannelDetailsCached = cache(getChannelDetails);

function UserTelegramDetails({ user }: { user: User }) {
  const telegramChannel = use(
    getChannelDetailsCached(getTgClient(user.telegramSession), user.channelId)
  );

  return (
    <>
      <div className="mt-auto">
        <Card>
          <CardHeader>
            <CardTitle>Channel</CardTitle>
            <CardDescription>{telegramChannel?.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              <Link
                target="_blank"
                href={"https://t.me/" + telegramChannel.username}
                className="text-muted-foreground font-bold no-underline"
              >
                View in Telegram
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default UserTelegramDetails;

import React from "react";
import ConnectTelegram from "@/components/connectTelegram";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/actions";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { User } from "@/lib/types";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

async function Page() {
  const userClerk = await currentUser();
  if (!userClerk) return redirect("/login");
  const user = await getUser();

  if (
    user?.hasPublicTgChannel !== null &&
    user?.hasPublicTgChannel !== undefined &&
    user.accessHash &&
    user.channelId
  )
    return redirect("/files");

  return (
    <div>
      <ConnectTelegram user={user as NonNullable<User>} />
    </div>
  );
}

export default Page;

import React from 'react'
import ConnectTelegram from '@/components/connectTelegram'
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/actions";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { User } from '@/components/FilesRender';

async function Page() {
  console.log("user clekr");
  const userClerk = await currentUser();
  if (!userClerk) return redirect("/login");
  const user = await getUser();

  if (user && user.telegramSession && user.channelUsername) {
    redirect("/files");
  }
   console.log(user)

  return (
    <div>
      <ConnectTelegram user={user as User} />
    </div>
  );
}

export default Page
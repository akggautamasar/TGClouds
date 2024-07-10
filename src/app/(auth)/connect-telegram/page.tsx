import React from 'react'
import ConnectTelegram from '@/components/connectTelegram'
import { currentUser } from '@clerk/nextjs/server'
import { getUser } from '@/actions'
import { redirect } from 'next/navigation'
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { User } from "@/components/FilesRender";

async function Page() {
  console.log("user clekr");
  const userClerk = await currentUser();

  if (!userClerk) return redirect("/auth/login");

  console.log("get user from db");

  const user = await getUser(userClerk?.emailAddresses[0].emailAddress);
  console.log("cheeck user has neccessary details");

  if (user && user.telegramSession && user.channelId) {
    console.log("user has all details so lets take him to his files");
    redirect("/files");
  }

  console.log(
    "use doesn't have all details so lets take him to connect-telegram page "
  );

  return (
    <div>
      <ConnectTelegram user={user as User} />
    </div>
  );
}

export default Page
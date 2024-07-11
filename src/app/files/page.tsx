import { getUser } from "@/actions";
import DisplayFiles from "@/components/files";
import Files, { User } from "@/components/FilesRender";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export type FilesData = {
  title: string;
  type: string;
  size: string;
  src: string;
  name: string;
  id: string | number;
};

export const useUserPotected = async () => {
  const userClerk = await currentUser();
  if (!userClerk) return redirect("/login");
  const user = await getUser(userClerk?.emailAddresses[0].emailAddress);

   if (!user?.channelId || !user?.telegramSession) {
     return redirect("/connect-telegram");
   }

  return user as User
}

export default async function Home() {
  const user = await useUserPotected()

  return (
    <DisplayFiles>
      {/* @ts-ignore */}
      <Suspense fallback={'please wait '}>
        <Files user={user} />
      </Suspense>
    </DisplayFiles>
  );
}

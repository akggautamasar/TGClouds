import { getUser } from "@/actions";
import { Dashboard } from "@/components/dashboard";
import Files, { User } from "@/components/FilesRender";
import { LoadingItems } from "@/components/loading-files";
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

  return user as User;
};

export default async function Home() {
  const user = await useUserPotected();

  return (
    <Dashboard user={user}>
      <Suspense fallback={<LoadingItems />}>
        <Files user={user} />
      </Suspense>
    </Dashboard>
  );
}

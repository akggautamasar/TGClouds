"use server";

import { cookies } from "next/headers";
import { tgClient } from "./lib/tgClient";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { usersTable } from "./db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function uploadFiles(formData: FormData) {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/auth");

  const user = await getUser(clerkUser?.emailAddresses[0].emailAddress);
  const sessionString = user?.telegramSession;
  const client = tgClient(sessionString as string);
  await client.connect();

  const files = formData.getAll("files") as File[];
  try {
    for (const file of files) {
      const toUpload = await client.uploadFile({ file, workers: 1 });

      const result = await client.sendFile(user?.channelId, {
        file: toUpload,
        forceDocument: true,
      });
      console.log("File uploaded successfully:", result);
      revalidatePath("/");
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("there was an error");
  } finally {
    await client.disconnect();
  }
}

export async function delelteItem(postId: number | string) {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/auth");

  const user = await getUser(clerkUser?.emailAddresses[0].emailAddress);

  const sessionString = user?.telegramSession;
  const client = tgClient(sessionString as string);
  await client.connect();

  try {
    await client.deleteMessages(user?.channelId, [Number(postId)], {
      revoke: true,
    });
    revalidatePath("/");
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("there was an error");
  } finally {
    await client.disconnect();
  }
}

export async function saveTelegramCredentials(
  channelId: string | null,
  session: string
) {
  if (!session)
    throw new Error("session is needed please provide channelId");

  const user = await currentUser();


  console.log(arguments, 'arugments')

  if (!user) {
    throw new Error("User needs to be loggedIn");
  }
  const email = user?.emailAddresses?.[0].emailAddress;


  try {
    const result = await getUser(email);
    if (!result) {
      const name = user?.fullName ?? `${user.firstName} ${user.lastName}`;
      await db.insert(usersTable).values({
        email,
        name,
        id: user.id,
        channelId,
        telegramSession: session,
      });
    }
    const r = await db
      .update(usersTable)
      .set({ channelId, telegramSession: session })
      .where(eq(usersTable.email, result?.email!));
  } catch (err) {
    console.error(err)
    throw new Error("There was an error while saving Telegram Credentials");
  }
   console.log('oops')
  if (channelId && session) {
    redirect('/files')
  }
}

export async function getUser(email: string) {
  try {
    const result = await db.query.usersTable.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email);
      },
    });

    return result;
  } catch (err) {
    throw new Error("There was an error while getting Files");
  }
}

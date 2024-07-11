"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "./db";
import { usersTable } from "./db/schema";

export async function saveTelegramCredentials(
  channelId: string | null,
  session: string
) {
  if (!session) {
    throw new Error("Session is required. Please provide channelId.");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("User needs to be logged in.");
  }

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("User email is not available.");
  }

  let shouldRedirect = false;

  try {
    const existingUser = await getUser(email);

    if (!existingUser) {
      const name = user.fullName ?? `${user.firstName} ${user.lastName}`;
      await db.insert(usersTable).values({
        email,
        name,
        id: user.id,
        channelId,
        telegramSession: session,
      });
    }

    if (existingUser) {
      await db
        .update(usersTable)
        .set({
          channelId,
          telegramSession: session,
        })
        .where(eq(usersTable.email, email));
    }

    console.log(channelId, session);

    if (channelId && session) {
      shouldRedirect = true;
    }
  } catch (error) {
    console.error("Error while saving Telegram credentials:", error);
    throw new Error("There was an error while saving Telegram credentials.");
  }

  if (shouldRedirect) {
    return redirect("/files");
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
    throw new Error("There was an error while getting User");
  }
}

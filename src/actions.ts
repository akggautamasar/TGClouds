"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { usersTable } from "./db/schema";

export async function saveTelegramCredentials(session: string) {
  if (!session) {
    throw new Error("Session is required ");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("user needs to be logged in.");
  }

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("user email is not available.");
  }

  try {
    const existinguser = await getUser(email);

    if (!existinguser) {
      const name = user.fullName ?? `${user.firstName} ${user.lastName}`;
      const data = await db
        .insert(usersTable)
        .values({
          email,
          name,
          id: user.id,
          telegramSession: session,
        })
        .returning();
      return data;
    }

    const result = await db
      .update(usersTable)
      .set({
        telegramSession: session,
      })
      .where(eq(usersTable.email, email))
      .returning();
  } catch (error) {
    console.error("Error while saving Telegram credentials:", error);
    throw new Error("There was an error while saving Telegram credentials.");
  }
}

export const saveChannelName = async (channelUserName: string) => {
  //TODO: save channel name and
};

export async function getUser(email: string) {
  try {
    const result = await db.query.usersTable.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email);
      },
    });

    return result;
  } catch (err) {
    throw new Error("There was an error while getting user");
  }
}

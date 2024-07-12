"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { userFiles, usersTable } from "./db/schema";
import { redirect } from "next/navigation";
import { User } from "./components/FilesRender";

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
    const existinguser = await getUser();

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
      return result
  } catch (error) {
    console.error("Error while saving Telegram credentials:", error);
    throw new Error("There was an error while saving Telegram credentials.");
  }
}

export const saveUserName = async (username: string) => {


  const user = await currentUser();
  if (!user) {
    throw new Error("user needs to be logged in.");
  }

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("user email is not available.");
  }

  try {
    const existinguser = await getUser();

    if (!existinguser) {
      const name = user.fullName ?? `${user.firstName} ${user.lastName}`;
      const data = await db
        .insert(usersTable)
        .values({
          email,
          name,
          id: user.id,
          channelUsername: username
        })
        .returning();
      return data;
    }

    const result = await db
      .update(usersTable)
      .set({
        channelUsername: username
      })
      .where(eq(usersTable.email, email))
      .returning();
    return result
  } catch (error) {
    console.error("Error while saving Telegram credentials:", error);
    throw new Error("There was an error while saving Telegram credentials.");
  }
}


export async function getUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("user needs to be logged in.");
  }

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("user email is not available.");
  }

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


export async function getAllFiles() {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated or user ID is missing');
    }

    const files = await db
      .select()
      .from(userFiles)
      .where(eq(userFiles.userId, user.id))
      .execute();

    return files;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching files:', err.message);
      throw new Error('Failed to fetch files. Please try again later.');
    }
  }
}


export async function uploadFile(file: {
  fileName: string;
  mimeType: string;
  size: bigint;
  url: string;
}) {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated or user ID is missing');
    }

    const result = await db
      .insert(userFiles)
      .values({
        id: generateId(), 
        userId: user.id,
        fileName: file.fileName,
        mimeType: file.mimeType,
        size: file.size,
        url: file.url,
        date: new Date().toDateString(),
      })
      .execute();

    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error uploading file:', err?.message);
      throw new Error('Failed to upload file. Please try again later.');
    }
  }
}


function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const useUserProtected = async () => {
  const userClerk = await currentUser();
  if (!userClerk) return redirect("/login");
  const user = await getUser();

  if (!user?.channelUsername || !user?.telegramSession) {
    return redirect("/connect-telegram");
  }

  return user as User
};
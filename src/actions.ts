"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, asc, count, desc, eq, ilike, like } from "drizzle-orm";
import { db } from "./db";
import { userFiles, usersTable } from "./db/schema";
import { redirect } from "next/navigation";
import { User } from "./components/FilesRender";

export async function saveTelegramCredentials({
  accessHash,
  channelId,
  channelTitle,
  session,
}: {
  session: string;
  accessHash: string;
  channelId: string;
  channelTitle: string;
}) {
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
          accessHash: accessHash,
          channelId: channelId,
          channelTitle: channelTitle,
        })
        .returning();
      return user.id;
    }

    const result = await db
      .update(usersTable)
      .set({
        telegramSession: session,
        accessHash: accessHash,
        channelId: channelId,
        channelTitle: channelTitle,
      })
      .where(eq(usersTable.email, email))
      .returning();
    return session;
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
      const name = user?.fullName ?? `${user.firstName} ${user.lastName}`;
      const data = await db
        .insert(usersTable)
        .values({
          email,
          name,
          id: user.id,
          channelUsername: username,
        })
        .returning();
      return data;
    }

    const result = await db
      .update(usersTable)
      .set({
        channelUsername: username,
      })
      .where(eq(usersTable.email, email))
      .returning();
    return result;
  } catch (error) {
    console.error("Error while saving Telegram credentials:", error);
    throw new Error("There was an error while saving Telegram credentials.");
  }
};

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

export async function getAllFiles(searchItem?: string, offset?: number) {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      throw new Error("User not authenticated or user ID is missing");
    }

    if (searchItem) {
      const results = await db
        .select()
        .from(userFiles)
        .where(
          and(
            like(userFiles.fileName, `%${searchItem}%`),
            eq(userFiles.userId, user.id)
          )
        )
        .orderBy(asc(userFiles.id))
        .limit(8)
        .offset(offset ?? 0)
        .execute();

      const total = (
        await db
          .select({ count: count() })
          .from(userFiles)
          .where(
            and(
              ilike(userFiles.fileName, `%${searchItem}%`),
              eq(userFiles.userId, user.id)
            )
          )
          .execute()
      )[0].count;

      return [results, total];
    }

    const results = await db
      .select()
      .from(userFiles)
      .where(eq(userFiles.userId, user.id))
      .orderBy(asc(userFiles.id))
      .limit(8)
      .offset(offset ?? 0)
      .execute();

    const total = (
      await db
        .select({ count: count() })
        .from(userFiles)
        .where(eq(userFiles.userId, user.id))
        .execute()
    )[0].count;

    return [results, total];
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching files:", err.message);
      throw new Error("Failed to fetch files. Please try again later.");
    }
  }
}

export async function getFilesFromSpecificType({
  fileType,
  searchItem,
  offset,
}: {
  searchItem?: string;
  fileType: string;
  offset?: number;
}) {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      throw new Error("User not authenticated or user ID is missing");
    }

    if (searchItem) {
      const results = await db
        .select()
        .from(userFiles)
        .where(
          and(
            ilike(userFiles.fileName, `%${searchItem}%`),
            eq(userFiles.mimeType, fileType),
            eq(userFiles.userId, user.id)
          )
        )
        .orderBy(asc(userFiles.id))
        .limit(8)
        .offset(offset ?? 0)
        .execute();

      const total = (
        await db
          .select({ count: count() })
          .from(userFiles)
          .where(
            and(
              ilike(userFiles.fileName, `%${searchItem}%`),
              eq(userFiles.mimeType, fileType),
              eq(userFiles.userId, user.id)
            )
          )
          .execute()
      )[0].count;

      return [results, total];
    }

    const results = await db
      .select()
      .from(userFiles)
      .where(
        and(eq(userFiles.mimeType, fileType), eq(userFiles.userId, user.id))
      )
      .orderBy(asc(userFiles.id))
      .limit(8)
      .offset(offset ?? 0)
      .execute();

    const total = (
      await db
        .select({ count: count() })
        .from(userFiles)
        .where(
          and(eq(userFiles.mimeType, fileType), eq(userFiles.userId, user.id))
        )
        .execute()
    )[0].count;

    return [results, total];
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching files:", err.message);
      throw new Error("Failed to fetch files. Please try again later.");
    }
  }
}

export async function uploadFile(file: {
  fileName: string;
  mimeType: string;
  size: bigint;
  url: string;
  fileTelegramId: number;
}) {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      throw new Error("User not authenticated or user ID is missing");
    }

    const result = await db
      .insert(userFiles)
      .values({
        id: await generateId(),
        userId: user.id,
        fileName: file.fileName,
        mimeType: file.mimeType,
        size: file.size,
        url: file.url,
        date: new Date().toDateString(),
        fileTelegramId: String(file.fileTelegramId),
      })
      .returning();

    console.log(result);

    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error uploading file:", err?.message);
      throw new Error("Failed to upload file. Please try again later.");
    }
  }
}

export async function deleteFile(fileId: number) {
  try {
    const user = await getUser();
    if (!user) throw new Error("you need to be logged to delete files");
    const deletedFile = await db
      .delete(userFiles)
      .where(
        and(eq(userFiles.userId, user.id), eq(userFiles.id, Number(fileId)))
      )
      .returning();
    return deletedFile;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
}

async function generateId() {
  const result = await db
    .select()
    .from(userFiles)
    .orderBy(desc(userFiles.id))
    .limit(1);

  const latestRecord = result[0];
  const newId = latestRecord ? latestRecord.id + 1 : 1;
  return newId;
}

export const useUserProtected = async () => {
  const userClerk = await currentUser();
  if (!userClerk) return redirect("/login");
  const user = await getUser();

  if (!user?.channelUsername || !user?.telegramSession) {
    return redirect("/connect-telegram");
  }

  return user as User;
};

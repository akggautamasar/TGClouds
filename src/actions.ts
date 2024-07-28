"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "./db";
import { userFiles, usersTable } from "./db/schema";
import { revalidatePath } from "next/cache";
import { User } from "./lib/types";

import { Resend } from "resend";
import Email from "@/components/email";
import React from "react";
import { env } from "./env";

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
    console.log(err);
    if (err instanceof Error) throw new Error(err.message);
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
            ilike(userFiles.fileName, `%${searchItem}%`),
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
            eq(userFiles.category, fileType),
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
              eq(userFiles.category, fileType),
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
        and(eq(userFiles.category, fileType), eq(userFiles.userId, user.id))
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
          and(eq(userFiles.category, fileType), eq(userFiles.userId, user.id))
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
        category: file?.mimeType?.split("/")[0],
      })
      .returning();
    revalidatePath("/files");
    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error uploading file:", err?.message);
      throw new Error("Failed to upload file. Please try again later.");
    }
  } finally {
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

  const hasNotDecidedToHavePrivateChannle =
    user?.hasPublicTgChannel === null || user?.hasPublicTgChannel === undefined;

  const hasNotHaveNeccessaryDetails = !user?.accessHash || !user?.channelId;

  if (hasNotDecidedToHavePrivateChannle || hasNotHaveNeccessaryDetails)
    return redirect("/connect-telegram");

  if (!user.channelUsername && (!user.channelId || !user.accessHash)) {
    throw new Error("There was something wrong");
  }

  return user as User;
};

export const updateHasPublicChannelStatus = async (isPublic: boolean) => {
  try {
    const user = await getUser();
    if (!user)
      throw new Error("Seems lke you are not authenticated", {
        cause: "AUTH_ERR",
      });
    await db
      .update(usersTable)
      .set({ hasPublicTgChannel: isPublic })
      .where(eq(usersTable.id, user.id))
      .returning();
    return user.id;
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
  }
  throw new Error("There was an error while updating status");
};

function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export async function subscribeToPro() {
  try {
    const user = await getUser();
    if (!user) throw new Error("Failed to get user");

    let currentExpirationDate = user.subscriptionDate
      ? new Date(user.subscriptionDate)
      : new Date();
    if (currentExpirationDate < new Date()) {
      currentExpirationDate = new Date();
    }

    const newExpirationDate = addDays(currentExpirationDate, 30).toISOString();

    const result = await db
      .update(usersTable)
      .set({ isSubscribedToPro: true, subscriptionDate: newExpirationDate })
      .where(eq(usersTable.id, user.id))
      .returning();

    await sendEmail(user, newExpirationDate);

    return { isDone: true, result };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function sendEmail(user: User, expirationDate: string) {
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user?.email!,
    subject: "Pro Activated",
    react: React.createElement(Email, {
      expirationDate,
      userName: user?.name!,
    }),
  });
}

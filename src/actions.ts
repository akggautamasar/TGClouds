'use server'

import { cookies } from "next/headers";
import { tgClient } from "./lib/tgClient";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { usersTable } from "./db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function uploadFiles(formData: FormData) {
    const sessionString = cookies().get('tgSession')
    const client = tgClient(sessionString?.value as string)
    await client.connect()

    const files = formData.getAll('files') as File[]
    try {

        for (const file of files) {
            const toUpload = await client.uploadFile({ file, workers: 1 })

            const result = await client.sendFile("kuneDrive", {
                file: toUpload,
                forceDocument: true
            });
            console.log('File uploaded successfully:', result);
            revalidatePath('/')

        }
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message)
        }
        throw new Error('there was an error')
    } finally {
        await client.disconnect()
    }

}

export async function delelteItem(postId: number | string) {
    const sessionString = cookies().get('tgSession')
    const client = tgClient(sessionString?.value as string)
    await client.connect()

    try {
        await client.deleteMessages('kuneDrive', [Number(postId)], { revoke: true })
        revalidatePath('/')
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message)
        }
        throw new Error('there was an error')
    } finally {
        await client.disconnect()
    }
}



export async function saveTelegramSession(channelId: string) {
    if (!channelId) throw new Error('session is needed please provide session');

    const user = await currentUser();


    if (!user) {
        throw new Error('User email is required');
    }

    const email = user?.emailAddresses?.[0].emailAddress;


    const result = await db
        .select()
        .from(usersTable)
        .where(({ email: userEmail }) => eq(userEmail, email));

    console.log(result)
}
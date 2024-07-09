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



export async function saveTelegramCredentials(channelId: string, session: string) {
    if (!channelId || !session) throw new Error('session is needed please provide channelId');

    const user = await currentUser();

    if (!user) {
        throw new Error('User needs to be loggedIn');
    }
    const email = user?.emailAddresses?.[0].emailAddress;
    const result = await getUser(email)

    if (!result) {
        const name = user?.fullName ?? `${user.firstName} ${user.lastName}`
        const newUser = await db.insert(usersTable).values({ email, name, id: user.id, channelId, telegramSession: session })
        return newUser
    }

    const updatedUser = await db.update(usersTable).set({ channelId, telegramSession: session }).where(eq(usersTable.email, result?.email!))
    return updatedUser

}


export async function getUser(email: string) {
    const result = await db.query.usersTable.findFirst({
        where(fields, { eq }) {
            return eq(fields.email, email)
        },
    })

    return result
}
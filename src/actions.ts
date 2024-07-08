'use server'

import { cookies } from "next/headers";
import { tgClient } from "./lib/tgClient";



export async function uploadFiles(formData: FormData) {
    const sessionString = cookies().get('tgSession')
    const client = tgClient(sessionString?.value as string)
    await client.connect()

    const files = formData.getAll('files') as File[]
    console.log('files', files)
    try {

        for (const file of files) {
            const toUpload = await client.uploadFile({ file, workers: 1 })

            const result = await client.sendFile("kuneDrive", {
                file: toUpload
            });
            console.log('File uploaded successfully:', result);

        }
    } catch (err) {
        console.log(err)
    } finally {
        await client.disconnect()
    }

}

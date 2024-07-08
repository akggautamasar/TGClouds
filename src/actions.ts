'use server'

import { cookies } from "next/headers";
import { tgClient } from "./lib/tgClient";
import { revalidatePath } from "next/cache";

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
                file: toUpload,
                forceDocument:true
            });
            console.log('File uploaded successfully:', result);
            revalidatePath('/')

        }
    } catch (err) {
        if(err instanceof Error){
            throw new Error(err.message)
        }
        throw new Error('there was an error')
    } finally {
        await client.disconnect()
    }

}

export async function delelteItem(postId : number | string){
  console.log('channel', postId)


  const sessionString = cookies().get('tgSession')
  const client = tgClient(sessionString?.value as string)
  await client.connect()

  try {
    await client.deleteMessages('kuneDrive', [Number(postId)], {revoke : true})
    revalidatePath('/')
  } catch (err) {
    if(err instanceof Error){
        throw new Error(err.message)
    }
    throw new Error('there was an error')
  } finally {
      await client.disconnect()
  }


}
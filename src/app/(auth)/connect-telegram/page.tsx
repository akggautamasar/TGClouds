import React from 'react'
import ConnectTelegram from '@/components/connectTelegram'
import { currentUser } from '@clerk/nextjs/server'
import { getUser } from '@/actions'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

async function Page() {
  const userClerk = await currentUser()

  if (!userClerk) return redirect('/auth/login')

  const user = await getUser(userClerk?.emailAddresses[0].emailAddress)

  if (user && user.telegramSession && user.channelId) {

    return redirect('/files')
  }
  return (
    <div>
      <ConnectTelegram />
    </div>
  )
}

export default Page
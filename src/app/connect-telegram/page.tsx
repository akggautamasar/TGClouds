'use client'

import { Button } from "@/components/ui/button";
import { env } from "@/env";
import Image from "next/image";
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import Swal from 'sweetalert2';
import { SVGProps } from "react";

async function getPhoneNumber() {
  return await Swal.fire({
    title: 'Enter your phone number',
    input: 'text',
    inputLabel: 'Phone Number',
    inputPlaceholder: 'Please Input Your Phone Number',
    showCancelButton: true
  }).then(result => result.value as number);
}



async function getCode() {
  return await Swal.fire({
    title: 'Enter the verification code',
    input: 'text',
    inputLabel: 'Verification Code',
    inputPlaceholder: 'Please Input the code',
    showCancelButton: true
  }).then(result => result.value as number);
}


async function getPassword() {
  return await Swal.fire({
    title: 'Enter Your Password',
    input: 'text',
    inputLabel: 'Password',
    inputPlaceholder: 'Please Enter Your password',
    showCancelButton: true
  }).then(result => result.value as number);
}

const SESSION = new StringSession('')

export default function Component() {
  
  async function connectTelegram() {
    const client = new TelegramClient(SESSION, env.NEXT_PUBLIC_TELEGRAM_API_ID, env.NEXT_PUBLIC_TELEGRAM_API_HASH, { connectionRetries: 5 })

    await client.start({
      phoneNumber: async () => await getPhoneNumber() as unknown as string,
      password: async () => await getPassword() as unknown as string,
      phoneCode: async () => await getCode() as unknown as string,
      onError: (err) => console.log(err),
    });
    console.log("You should now be connected.", client.session);
    console.log(client.session.save());
  }



  return (
    <div className="w-full bg-white py-20 md:py-32 lg:py-40">
      <div className="container flex flex-col items-center justify-between gap-10 px-4 md:flex-row md:gap-16">
        <div className="max-w-md space-y-6 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[#00b894] sm:text-4xl md:text-5xl">
            Connect Your Telegram Account
          </h1>
          <p className="text-lg text-[#00b894]/90 md:text-xl">
            Link your Telegram account to our cloud platform and enjoy seamless
            file storage and sharing.
          </p>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Button onClick={() => connectTelegram()} className="w-full md:w-auto">
              <TextIcon className="mr-2 h-5 w-5" />
              Connect Telegram
            </Button>
          </div>
        </div>
        <div className="w-full max-w-md">
          <Image
            src="https://via.placeholder.com/500x500"
            alt="Connect Telegram"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}

function TextIcon(props : SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  );
}














"use client";

import { saveChannelName, saveTelegramCredentials } from "@/actions";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getTgClient } from "@/lib/getTgClient";
import Image from "next/image";
import { SVGProps, useState } from "react";
import Swal from "sweetalert2";
import { TelegramClient } from "telegram";

async function getPhoneNumber() {
  return await Swal.fire({
    title: "Enter your phone number",
    input: "text",
    inputLabel: "Phone Number",
    inputPlaceholder: "Please Input Your Phone Number",
    showCancelButton: true,
  }).then((result) => result.value as number);
}
async function getCode() {
  return await Swal.fire({
    title: "Enter the verification code",
    input: "text",
    inputLabel: "Verification Code",
    inputPlaceholder: "Please Input the code",
    showCancelButton: true,
  }).then((result) => result.value as number);
}
async function getPassword() {
  return await Swal.fire({
    title: "Enter Your Password",
    input: "text",
    inputLabel: "Password",
    inputPlaceholder: "Please Enter Your password",
    showCancelButton: true,
  }).then((result) => result.value as number);
}

export default function Component({
  user,
}: {
  user: NonNullable<Awaited<ReturnType<typeof db.query.usersTable.findFirst>>>;
}) {
  const [channelDeteails, setChannelDetails] = useState<{
    session?: string | null;
    channleId?: string | null;
  }>({
    session: user?.telegramSession,
    channleId: user?.channelUsername,
  });

  const router = useRouter();

  const [client, setClient] = useState<TelegramClient | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>();
  async function connectTelegram() {
    const SESSION = user?.telegramSession ?? "";
    let client: TelegramClient | undefined;
    try {
      setIsLoading(true);

      client = getTgClient(SESSION);

      if (!SESSION) {
        console.log("session no session so creating new");
        await client.start({
          phoneNumber: async () =>
            (await getPhoneNumber()) as unknown as string,
          password: async () => (await getPassword()) as unknown as string,
          phoneCode: async () => (await getCode()) as unknown as string,
          onError: (err) => console.log(err),
        });
        const session = client.session.save() as unknown as string;

        const result = saveTelegramCredentials(session);

        const detail = channelDeteails
          ? { ...channelDeteails, session }
          : { session };

        setChannelDetails(detail);
      }
      setClient(client);
      if (!client.connected) await client.connect();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      client?.disconnect();
    }
  }

  async function connectChannel(username: string) {
    try {
      setIsLoading(true);

      if (client) {
        const channelDetails = await getChannelDetails(client, username);
        showChannelusernamePrompt(channelDetails);
        console.log(channelDetails);
        return;
      }

      const client2 = getTgClient(user.telegramSession!);
      const channelDetails = await getChannelDetails(client2, username);
      if (!channelDetails.isCreator) {
        alert("you are not the creator of the channel");
        return;
      }
      const isConfirmed = await showChannelusernamePrompt(channelDetails);

      if (isConfirmed) {
        await saveChannelName(user.telegramSession!);
        router.push("/files");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (channelDeteails.session) return <Component2 onSubmit={connectChannel} />;

  return (
    <div className="w-full bg-white py-20 md:py-32 lg:py-40">
      <div className="container flex flex-col items-center justify-between gap-10 px-4 md:flex-row md:gap-16">
        <div className="max-w-md space-y-6 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-5xl">
            Connect Your Telegram Account
          </h1>
          <p className="text-lg text-[#00b894]/90 md:text-xl">
            Link your Telegram account to our cloud platform and enjoy seamless
            file storage and sharing.
          </p>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Button
              disabled={isLoading}
              variant={"secondary"}
              onClick={() => connectTelegram()}
              className="w-full md:w-auto"
            >
              <TextIcon className="mr-2 h-5 w-5" />
              {isLoading ? "please wait..." : " Connect Telegram"}
            </Button>
          </div>
        </div>
        <div className="w-full max-w-md">
          <Image
            src={"/tgConnect.jpg"}
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

function TextIcon(props: SVGProps<SVGSVGElement>) {
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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getChannelDetails } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

function Component2({ onSubmit }: { onSubmit: (username: string) => void }) {
  return (
    <div className="h-[100dvh] flex justify-center items-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect Your Telegram Account</CardTitle>
          <CardDescription>
            Connect your Telegram account to create a channel for secure cloud
            storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">
                Step 1: Create a Telegram Channel
              </h3>
              <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Open the Telegram app on your device.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>
                    Tap on the <strong>Menu</strong> icon and select{" "}
                    <strong>New Channel</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Give your channel a name and a description</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>
                    Give your unique username<strong>Create</strong>.
                  </span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                Step 2: Connect Your Telegram Channel
              </h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e?.currentTarget);
                    const username = formData.get("channel-username");
                    onSubmit(username as string);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Label htmlFor="channel-username">
                      Telegram Channel username
                    </Label>
                    <Input
                      id="channel-username"
                      name="channel-username"
                      placeholder="@mychannel"
                    />
                  </div>
                  <div>
                    <Button className="w-full my-4 p-2">Connect</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

async function showChannelusernamePrompt(channelDetails: any) {
  const result = await Swal.fire({
    title: "Channel Details",
    html: `
            <strong>Channel Name:</strong> ${channelDetails.title}<br>
            <strong>Channel username:</strong> ${channelDetails.username}<br>
            <strong>Channel ID:</strong> ${channelDetails.channelusername}<br>
            <strong>Creator:</strong> ${channelDetails.isCreator}<br>
            <strong>Group or Channel:</strong> ${
              channelDetails.isBroadcast ? "Channel" : "Group"
            }<br>
        `,
    icon: "info",
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: `
            <i class="fa fa-thumbs-up"></i> Confirm
        `,
    confirmButtonAriaLabel: "Confirm",
    cancelButtonText: `
            <i class="fa fa-thumbs-down"></i> Cancel
        `,
    cancelButtonAriaLabel: "Cancel",
  });
  return result.isConfirmed;
}

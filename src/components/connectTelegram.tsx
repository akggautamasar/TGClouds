"use client";

import { saveTelegramCredentials, saveUserName } from "@/actions";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getTgClient } from "@/lib/getTgClient";
import Image from "next/image";
import { SVGProps, useEffect, useLayoutEffect, useState } from "react";
import Swal from "sweetalert2";
import { Api } from "telegram";

interface Chat {
  id: string;
  accessHash?: string;
}

interface Result {
  chats?: Chat[];
}

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
  const [isLoading, setIsLoading] = useState<boolean>();
  const [session, setSession] = useState<string | null>(user?.telegramSession);

  const [channelDetails, setChannelDetails] = useState<{
    title: string | null;
    id: string | undefined;
    accessHash: string | undefined;
  }>({
    title: null,
    id: undefined,
    accessHash: undefined,
  });

  const client = getTgClient(session ?? "");
  const router = useRouter();
  async function connectTelegram() {
    try {
      setIsLoading(true);
      if (!session) {
        await loginInTelegram();
      }

      if (!client?.connected) {
        await client.connect();
      }

      await createTelegramChannel();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      client?.disconnect();
    }
  }

  async function loginInTelegram() {
    await client.start({
      phoneNumber: async () => (await getPhoneNumber()) as unknown as string,
      password: async () => (await getPassword()) as unknown as string,
      phoneCode: async () => (await getCode()) as unknown as string,
      onError: (err) => console.log(err),
    });

    const session = client.session.save() as unknown as string;
    await saveTelegramCredentials(session);
    setSession(session);
  }

  async function createTelegramChannel() {
    const channelTitle =
      (user?.name ?? user?.email?.split("@")[0]) + "Drive" ?? "TGCloudDrive";
    const res = await client.invoke(
      new Api.channels.CreateChannel({
        title: channelTitle,
        about:
          "Don't delete this channel or you will lose all your files in https://tg-cloud-k.vercel.app",
        broadcast: true,
      })
    );

    const result = res as Result;

    if (result?.chats?.[0].id) {
      setChannelDetails({
        title: channelTitle,
        id: result.chats?.[0].id!,
        accessHash: result.chats?.[0].accessHash!,
      });

      Swal.fire({
        title: "Channel created",
        text: "We have created a channel in Telegram for you",
        timer: 3000,
      });
    } else {
      Swal.fire({
        title: "failed to create channel",
        text: ("message" in res && res?.message) ?? "there was an error",
        timer: 3000,
      });
    }
  }

  async function connectChannel({
    channelId,
    username,
  }: {
    username: string;
    channelId: string;
  }) {
    try {
      if (!client.connected) await client.connect();

      const inputChannel = new Api.InputChannel({
        //@ts-ignore
        channelId: channelId,
        //@ts-ignore
        accessHash: accessHash,
      });

      const result = await client.invoke(
        new Api.channels.CheckUsername({
          channel: inputChannel,
          username: username,
        })
      );

      if (!result) {
        window.confirm("username is alreay taken");
        return;
      }

      await client
        .invoke(
          new Api.channels.UpdateUsername({
            channel: inputChannel,
            username: username,
          })
        )
        .then(async (res) => {
          await saveUserName(username);
          router.push("/files");
        });
      console.log("Username updated successfully.");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  }

  const { title, id, accessHash } = channelDetails;

  if (accessHash && title && id)
    return (
      <UpdateUsernameForm
        channelId={id}
        channelTitle={title}
        onSubmit={connectChannel}
      />
    );

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
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const UpdateUsernameForm = <
  T extends { channelTitle: string; channelId: string }
>({
  onSubmit,
  channelTitle,
  channelId,
}: {
  onSubmit: (arg: Pick<T, "channelId"> & { username: string }) => Promise<void>;
} & T) => {
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    await onSubmit({ channelId, username });
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Channel Created</CardTitle>
          <CardDescription>
            Your channel <strong>{channelTitle}</strong> has been created. Now,
            you can update its username.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <form
              action={() => {
                handleSubmit();
              }}
            >
              <div className="flex items-center gap-2">
                <Label htmlFor="channel-username">
                  Telegram Channel Username
                </Label>
                <Input
                  id="channel-username"
                  name="channel-username"
                  placeholder="@mychannel"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <UpdateButton />
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function UpdateButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      type="submit"
      className="w-full my-4 p-2 bg-blue-500 text-white hover:bg-blue-700"
    >
      {pending ? "please wait..." : " Update Username"}
    </Button>
  );
}

"use client";

import { saveTelegramCredentials, saveUserName } from "@/actions";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getTgClient } from "@/lib/getTgClient";
import Image from "next/image";
import { Dispatch, SetStateAction, SVGProps, useState } from "react";
import Swal from "sweetalert2";
import { Api } from "telegram";
import { RPCError } from "telegram/errors";
import { useDebouncedCallback } from "use-debounce";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { errorToast } from "@/lib/notify";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { error } from "console";

interface Chat {
  id: string;
  accessHash?: string;
}

interface Result {
  chats?: Chat[];
}

const errors = {
  checkusername: {
    CHANNELS_ADMIN_PUBLIC_TOO_MUCH:
      "You're managing too many public channels. To change this channel's username, make some of your public channels private.",
    CHANNEL_INVALID:
      "There seems to be a problem with the channel you provided. Please double-check the channel information.",
    CHAT_ID_INVALID:
      "The provided chat ID is invalid. Please ensure you're using the correct chat identifier.",
    USERNAME_INVALID:
      "The username you entered is invalid. Usernames must be between 5 and 32 characters long and can only contain letters, numbers, underscores, and hyphens.",
  },
  createChannel: {
    CHANNELS_ADMIN_LOCATED_TOO_MUCH:
      "You've reached the limit for creating public geogroups. Try creating a private channel instead.",
    CHANNELS_TOO_MUCH:
      "You've joined too many channels or supergroups. Reduce the number of channels you're in to create a new one.",
    CHAT_ABOUT_TOO_LONG:
      "The channel description is too long. Please shorten it and try again.",
    CHAT_TITLE_EMPTY: "Please provide a title for your new channel.",
    USER_RESTRICTED:
      "It seems your account has been restricted due to spam reports. You can't create channels or chats at this time.",
  },
  updateUsername: {
    CHANNELS_ADMIN_PUBLIC_TOO_MUCH:
      "You're managing too many public channels. To change this channel's username, make some of your public channels private.",
    CHANNEL_INVALID:
      "There seems to be a problem with the channel you provided. Please double-check the channel information.",
    CHANNEL_PRIVATE:
      "You can't update the username of a private channel you haven't joined. Join the channel and try again.",
    CHAT_ADMIN_REQUIRED: "Only admins of the channel can change its username.",
    CHAT_NOT_MODIFIED:
      "There seems to be an issue updating the username. Please try again.",
    CHAT_WRITE_FORBIDDEN:
      "You don't have permission to make changes to the channel's username.",
    USERNAME_INVALID:
      "The username you entered is invalid. Usernames must be between 5 and 32 characters long and can only contain letters, numbers, underscores, and hyphens.",
    USERNAME_NOT_MODIFIED:
      "The username wasn't changed. Perhaps you entered the same username as the current one?",
    USERNAME_OCCUPIED:
      "The username you want is already taken. Please choose a different username.",
  },
} as const;

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

  const client = getTgClient(session ?? "");
  const router = useRouter();
  async function connectTelegram() {
    try {
      setIsLoading(true);
      let newSession: string | undefined;
      if (!session) {
        newSession = await loginInTelegram();
      }

      if (!client?.connected) {
        await client.connect();
      }

      const data = await createTelegramChannel()!;
      if (data) {
        const { accessHash, channelTitle, id } = data;
        await saveTelegramCredentials({
          session: newSession!,
          accessHash,
          channelId: id,
          channelTitle,
        });

        Swal.fire({
          title: "Channel created",
          text: "We have created a channel in Telegram for you",
          timer: 3000,
        });
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      client?.disconnect();
    }
  }

  async function loginInTelegram() {
    try {
      await client.start({
        phoneNumber: async () => (await getPhoneNumber()) as unknown as string,
        password: async () => (await getPassword()) as unknown as string,
        phoneCode: async () => (await getCode()) as unknown as string,
        onError: (err) => errorToast(err?.message),
      });

      const session = client.session.save() as unknown as string;
      return session;
    } catch (err) {
      if (err && typeof err == "object" && "message" in err) {
        Swal.fire({
          title: "failed to create channel",
          text: (err?.message as string) ?? "there was an error",
          timer: 3000,
        });
      }
    }
  }

  async function createTelegramChannel() {
    try {
      const channelTitle = user?.name ? `${user?.name}Drive` : "TGCloudDrive";
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
        return {
          channelTitle,
          id: result.chats?.[0].id,
          accessHash: result.chats?.[0].accessHash!,
        };
      }
    } catch (err) {
      if (err instanceof RPCError) {
        const text =
          errors.createChannel[
            err.errorMessage as keyof typeof errors.createChannel
          ];

        Swal.fire({
          title: err.message,
          text: text ?? "there was an error",
          timer: 3000,
        });
      } else {
        Swal.fire({
          title: "failed to create channel",
          //@ts-expect-error
          text: err?.message! ?? "there was an error",
          timer: 3000,
        });
      }
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
        channelId: user.channelId,
        //@ts-ignore
        accessHash: user.accessHash,
      });

      const result = await client.invoke(
        new Api.channels.CheckUsername({
          channel: inputChannel,
          username: username,
        })
      );

      if (!result) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "username is alreay taken",
        });
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
          await Swal.fire({
            icon:'success', 
            title:'Update success', 
            text:'you have update channle username now we will redirect you to dashborad in a minute', 
            timer:2000
          })
          router.push("/files");
        });
      console.log("Username updated successfully.");
    } catch (err) {
      console.error("Error updating username:", err);
      if (err instanceof RPCError) {
        const text =
          errors.updateUsername[
            err.errorMessage as keyof typeof errors.updateUsername
          ];
        Swal.fire({
          icon: "error",
          title: err.message,
          text: text,
        });
        return;
      }
      if (err && typeof err == "object" && "message" in err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message as string,
        });
      }
    }
  }

  const checkUserNameOnChange = async (
    username: string | undefined,
    setStatus: Dispatch<
      SetStateAction<{ type: "error" | "success"; message: string } | null>
    >
  ) => {
    if (!username) return;
    try {
      const inputChannel = new Api.InputChannel({
        //@ts-ignore
        channelId: user.channelId,
        //@ts-ignore
        accessHash: user.accessHash,
      });

      if (!client.connected) await client.connect();
      const result = await client.invoke(
        new Api.channels.CheckUsername({
          channel: inputChannel,
          username: username,
        })
      );
      if (!result) {
        setStatus({ type: "error", message: "username is alreay taken" });
        return;
      }
      setStatus({ message: "username available", type: "success" });
    } catch (err) {
      console.error(err);
      if (err instanceof RPCError) {
        const type = err.errorMessage as keyof typeof errors.checkusername;
        const text = errors.checkusername[type];
        setStatus({ message: text, type: "error" });
        return;
      }
      if (err && typeof err == "object" && "message" in err) {
        setStatus({ message: err.message as string, type: "error" });
      }
    }
  };

  if (user && user?.accessHash && user?.channelTitle && user?.channelId) {
    const { channelId, channelTitle } = user;

    return (
      <UpdateUsernameForm
        onChange={checkUserNameOnChange}
        channelId={channelId}
        channelTitle={channelTitle}
        onSubmit={connectChannel}
      />
    );
  }

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

const UpdateUsernameForm = <
  T extends { channelTitle: string; channelId: string }
>({
  onSubmit,
  channelTitle,
  channelId,
  onChange,
}: {
  onSubmit: (arg: Pick<T, "channelId"> & { username: string }) => Promise<void>;
  onChange: (
    username: string,
    setError: Dispatch<
      SetStateAction<{ type: "error" | "success"; message: string } | null>
    >
  ) => Promise<void>;
} & T) => {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const handleSubmit = async (username: string) => {
    setPending(true);
    await onSubmit({ channelId, username });
    setPending(false);
  };

  const checkUsername = useDebouncedCallback(onChange, 300);

  const isUpdateButtonDisabled = pending || status?.type !== "success";

  return (
    <div className="h-[100dvh] flex justify-center items-center">
      <Card className="w-full max-w-md md:max-w-lg mx-auto">
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
              action={(formData) => {
                const username = formData.get("channel-username");
                handleSubmit(username as unknown as string);
              }}
            >
              <div className="flex items-center gap-2">
                <Label htmlFor="channel-username">
                  Telegram Channel Username
                </Label>
                <div className="flex justify-center flex-col items-center gap-1">
                  <Input
                    id="channel-username"
                    name="channel-username"
                    placeholder="@mychannel"
                    onChange={(e) => {
                      if (!e.target.value) {
                        setStatus(null);
                        return;
                      }
                      checkUsername(e.target.value, setStatus);
                    }}
                    required
                  />
                  {status?.type == "error" ? (
                    <span className="text-sm text-[0.8em] text-red-500 block w-full">
                      {status.message}
                    </span>
                  ) : null}
                  {status?.type == "success" ? (
                    <span className="text-sm text-[0.8em] text-green-500 block w-full">
                      {status.message}
                    </span>
                  ) : null}
                </div>
              </div>
              <Button
                disabled={isUpdateButtonDisabled}
                type="submit"
                className={`w-full my-4 p-2 bg-blue-500 text-white hover:bg-blue-700 ${
                  isUpdateButtonDisabled ? "cursor-not-allowed" : ""
                }`}
              >
                {pending ? "please wait..." : " Update Username"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

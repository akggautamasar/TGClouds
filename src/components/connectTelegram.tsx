"use client";

import {
  saveTelegramCredentials,
  saveUserName,
  updateHasPublicChannelStatus,
} from "@/actions";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    html: `
      <label for="phone-input">Phone Number (include country code, e.g., +1)</label>
      <input type="text" id="phone-input" class="swal2-input" placeholder="+1 (555) 555-5555">
    `,
    inputAttributes: {
      inputmode: "tel",
      pattern: "\\+[0-9]{1,3}\\s?[0-9]{10}",
    },
    showCancelButton: true,

    preConfirm: () => {
      const phoneNumber = (
        Swal?.getPopup()?.querySelector("#phone-input") as HTMLInputElement
      ).value;
      if (!/^\+\d{1,3}\s?\d{10}$/.test(phoneNumber)) {
        Swal.showValidationMessage(
          "Please enter a valid phone number with the country code, e.g., +1 (555) 555-5555"
        );
      }
      return phoneNumber;
    },
  }).then((result) => result.value);
}

async function getCode() {
  return await Swal.fire({
    title: "Enter the verification code",
    html: `
      <label for="code-input">Verification Code</label>
      <input type="text" id="code-input" class="swal2-input" placeholder="Please enter the code you received from Telegram">
    `,
    inputAttributes: {
      inputmode: "numeric",
      pattern: "[0-9]{6}",
    },
    showCancelButton: true,

    preConfirm: () => {
      const code = (
        Swal?.getPopup()?.querySelector("#code-input") as HTMLInputElement
      ).value;
      if (!/^\d{5}$/.test(code)) {
        Swal.showValidationMessage(
          "Please enter a valid 5-digit verification code."
        );
        setTimeout(() => {
          Swal.resetValidationMessage;
        }, 5000);
      }
      return code;
    },
  }).then((result) => result.value);
}

async function getPassword() {
  return await Swal.fire({
    title: "Enter Your Password",
    html: `
      <label for="password-input">Password</label>
      <input type="password" id="password-input" class="swal2-input" placeholder="Please enter your password">
      <input type="checkbox" id="toggle-password" style="margin-top: 10px;">
      <label for="toggle-password" style="margin-left: 5px;">Show Password</label>
    `,
    showCancelButton: true,
    didOpen: () => {
      const passwordInput = Swal?.getPopup()?.querySelector(
        "#password-input"
      ) as HTMLInputElement;
      const togglePassword = Swal?.getPopup()?.querySelector(
        "#toggle-password"
      ) as HTMLInputElement;

      togglePassword.addEventListener("change", () => {
        if (togglePassword.checked) {
          passwordInput.type = "text";
        } else {
          passwordInput.type = "password";
        }
      });
    },
    preConfirm: () => {
      const password = (
        Swal?.getPopup()?.querySelector("#password-input") as HTMLInputElement
      ).value;
      if (!password) {
        Swal.showValidationMessage("Please enter your password.");
      }
      return password;
    },
  }).then((result) => result.value);
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
        location.reload();
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
          await Promise.all([
            saveUserName(username),
            updateHasPublicChannelStatus(true),
          ]);
          await Swal.fire({
            icon: "success",
            title: "Update success",
            text: "you have update channle username now we will redirect you to dashborad in a minute",
            timer: 2000,
          });
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

const showChannelVisisblityConfrimation = async (visibility: string) => {
  return await Swal.fire({
    title: "Confirm Channel Visibility",
    text: `Are you sure you want to make your channel ${visibility} ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Yes, make it ${visibility} 👍`,
    cancelButtonText: "No,let Me Think 🤔",
  });
};

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

  const router = useRouter();

  const handleSubmit = async (username: string) => {
    setPending(true);
    await onSubmit({ channelId, username });
    setPending(false);
  };

  const [isPublic, setIsPublic] = useState(false);
  const checkUsername = useDebouncedCallback(onChange, 200);
  const isUpdateButtonDisabled = pending || status?.type !== "success";

  const makePrivake = async () => {
    setPending(true);
    const result = await showChannelVisisblityConfrimation("private");
    if (result.isConfirmed) {
      await updateHasPublicChannelStatus(false);
      router.push("/files");
    }
    setPending(false);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="space-y-4 max-w-lg w-full">
        <div className="bg-white p-4 rounded shadow-sm">
          <WarningIndicator />
          <Select
            onValueChange={(value: string) => setIsPublic(value === "public")}
          >
            <SelectTrigger className="w-full mt-4">
              <SelectValue placeholder="Channel Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isPublic ? (
          <Card className="bg-white text-black p-4 rounded shadow-sm">
            <CardHeader>
              <CardTitle className="text-black">Channel Created</CardTitle>
              <CardDescription>
                Your channel <strong>{channelTitle}</strong> has been created.
                Now, you can update its username.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData) => {
                  const result = await showChannelVisisblityConfrimation(
                    "public"
                  );
                  if (!result.isConfirmed) return;
                  const username = formData.get("channel-username") as string;
                  handleSubmit(username);
                }}
                className="space-y-4"
              >
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="channel-username">
                    Telegram Channel Username
                  </Label>
                  <Input
                    id="channel-username"
                    name="channel-username"
                    className="text-white"
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
                  {status && (
                    <span
                      className={`text-sm block w-full ${
                        status.type === "error"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {status.message}
                    </span>
                  )}
                </div>
                <Button
                  disabled={isUpdateButtonDisabled}
                  type="submit"
                  className={`w-full p-2 text-white ${
                    isUpdateButtonDisabled
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-700"
                  }`}
                >
                  {pending ? "Please wait..." : "Update Username"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white p-4 rounded shadow-sm text-center">
            <Button onClick={makePrivake} disabled={pending}>
              {pending ? <LoadingSVG /> : "Continue Private"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

import Link from "next/link";
import { LoadingSVG } from "./Icons/icons";

export function WarningIndicator() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <TriangleAlertIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-yellow-800">
            Your channel is private by default
          </h3>
          <div className="mt-2 text-yellow-700">
            <p className="text-gray-700">
              Your channel is private by default. You can make it public, but
              keep in mind that if you do, your channel will be accessible to
              anyone, and they might be able to view your content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TriangleAlertIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

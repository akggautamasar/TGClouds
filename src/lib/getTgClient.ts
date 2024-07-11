import { StringSession } from "telegram/sessions";
import { TelegramClient } from "telegram";
import { env } from "@/env";
import React from "react";

export function getTgClient(telegramSession: string) {
  const session = new StringSession(telegramSession);
  const client = new TelegramClient(
    session,
    env.NEXT_PUBLIC_TELEGRAM_API_ID,
    env.NEXT_PUBLIC_TELEGRAM_API_HASH,
    {
      connectionRetries: 5,
    }
  );
  return client;
}

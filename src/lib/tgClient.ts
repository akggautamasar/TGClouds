import { StringSession } from 'telegram/sessions'
import { TelegramClient } from "telegram"
import { env } from "@/env";

export function tgClient(telegramSession: string) {
  const session = new StringSession(telegramSession);
  const client = new TelegramClient(
    session,
    env.TELEGRAM_API_ID,
    env.TELEGRAM_API_HASH,
    { connectionRetries: 3, autoReconnect: false }
  );
  return client
}
"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";
import { TelegramClient } from "telegram";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#c21333"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
};

export default Providers;

export const TgClientContext = React.createContext<TelegramClient | undefined>(
  undefined
);

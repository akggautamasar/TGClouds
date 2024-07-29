import {
  bigint,
  boolean,
  date,
  foreignKey,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["ANNUAL", "MONTHLY"]);

export const usersTable = pgTable(
  "usersTable",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    telegramSession: text("telegramSession"),
    channelUsername: text("channelName").unique(),
    channelId: text("channelId").unique(),
    accessHash: text("accessHash"),
    channelTitle: text("channelTitle"),
    hasPublicTgChannel: boolean("hasPublicChannel"),
    isSubscribedToPro: boolean("is_subscribed_to_pro").default(false),
    subscriptionDate: date("subscription_date"),
    plan: planEnum("plan"),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

export const sharedFilesTable = pgTable(
  "sharedFiles",
  {
    id: text("id").primaryKey(),
    fileId: text("fileId"),
    userId: text("userId").notNull(),
  },
  (table) => ({
    fkUserId: foreignKey({
      columns: [table.userId],
      foreignColumns: [usersTable.id],
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  })
);

export const paymentsTable = pgTable(
  "paymentsTable",
  {
    id: text("id").primaryKey(),
    amount: text("amount").notNull(),
    currency: text("currency").notNull(),
    userId: text("userId").notNull(),
    tx_ref: text("tx_ref").notNull().unique(),
    customizationTitle: text("customizationTitle"),
    customizationDescription: text("customizationDescription"),
    customizationLogo: text("customizationLogo"),
    paymentDate: date("paymentDate").$defaultFn(() => new Date().toISOString()),
    isPaymentDONE: boolean("isPaymentDONE").default(false),
    plan: planEnum("plan"),
  },
  (table) => ({
    fkUserId: foreignKey({
      columns: [table.userId],
      foreignColumns: [usersTable.id],
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  })
);

export const userFiles = pgTable(
  "userFiles",
  {
    id: bigint("id", { mode: "number" }).primaryKey(),
    userId: text("userId").notNull(),
    fileName: text("filename").notNull(),
    mimeType: text("mimeType").notNull(),
    size: bigint("size", { mode: "bigint" }).notNull(),
    url: text("fileUrl").notNull(),
    date: date("date", { mode: "string" }).$defaultFn(() =>
      new Date().toDateString()
    ),
    fileTelegramId: text("fileTelegramId"),
    category: text("fileCategory"),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [usersTable.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  })
);

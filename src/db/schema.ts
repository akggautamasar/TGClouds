import {
  bigint,
  date,
  foreignKey,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
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
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [usersTable.id],
    }).onDelete("cascade"),
  })
);

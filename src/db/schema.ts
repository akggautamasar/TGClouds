import { bigint, pgTable, text, uniqueIndex, date, foreignKey } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "usersTable",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    telegramSession: text("telegramSession"),
    channelUsername: text("channelName").unique(),
    channelId: text("channelId").unique(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

export const userFiles = pgTable(
  "userFiles",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    fileName: text("filename").notNull(),
    mimeType: text("mimeType").notNull(),
    size: bigint("size", { mode: "bigint" }).notNull(),
    url: text("fileUrl").notNull(),
    date: date("date", { mode: "string" }).$defaultFn(() => new Date().toDateString()),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [usersTable.id],
    }),
  })
);

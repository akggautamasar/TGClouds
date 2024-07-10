import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { sessionTable, usersTable } from "./schema";

import { Client } from "pg";
import { env } from "@/env";

const client = new Client({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(client, {
  schema: { sessionTable, usersTable },
});

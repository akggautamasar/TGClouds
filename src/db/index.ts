import { drizzle } from "drizzle-orm/node-postgres";
import { sessionTable, usersTable } from "./schema";

import { env } from "@/env";
import { Pool } from "pg";

const client = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(client, {
  schema: { sessionTable, usersTable },
});

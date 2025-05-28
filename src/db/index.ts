import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { env } from '@/env';
import { Pool } from 'pg';

// Initialize PostgreSQL client pool using connection string from environment variables
const client = new Pool({
  connectionString: env.DATABASE_URL,
});

// Initialize Drizzle ORM instance with the PostgreSQL client and your schema
export const db = drizzle(client, {
  schema,
});

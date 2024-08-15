import { defineConfig } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';
import { env } from '@/env';

export default defineConfig({
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL
	},
	schema: './src/db/schema.ts',
	out: './migrations'
});

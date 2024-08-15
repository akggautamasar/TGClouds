import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		TELEGRAM_API_ID: z.string().transform((v) => parseInt(v)),
		TELEGRAM_API_HASH: z.string(),
		DATABASE_URL: z.string(),
		RESEND_API_KEY: z.string(),
		CHAPA_API_KEY: z.string()
	},
	client: {
		NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_TELEGRAM_API_ID: z.string().transform((v) => parseInt(v)),
		NEXT_PUBLIC_TELEGRAM_API_HASH: z.string(),
		NEXT_PUBLIC_SENTRY_AUTH_TOKEN: z.string()
	},
	runtimeEnv: {
		TELEGRAM_API_ID: process.env.TELEGRAM_API_ID,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		TELEGRAM_API_HASH: process.env.TELEGRAM_API_HASH,
		DATABASE_URL: process.env.DATABASE_URL,
		NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
		NEXT_PUBLIC_TELEGRAM_API_ID: process.env.NEXT_PUBLIC_TELEGRAM_API_ID,
		NEXT_PUBLIC_TELEGRAM_API_HASH: process.env.NEXT_PUBLIC_TELEGRAM_API_HASH,
		NEXT_PUBLIC_SENTRY_AUTH_TOKEN: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
		CHAPA_API_KEY: process.env.CHAPA_API_KEY
	}
});

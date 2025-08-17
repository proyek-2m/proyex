namespace NodeJS {
	interface ProcessEnv {
		DATABASE_URI: string
		CRON_SECRET: string
		PAYLOAD_SECRET: string
		PAYLOAD_PREVIEW_SECRET: string
		REVALIDATE_SECRET: string
		NODE_ENV: string
		NEXT_PUBLIC_SITE_URL: string
		SUPABASE_S3_BUCKET: string
		SUPABASE_S3_ACCESS_KEY_ID: string
		SUPABASE_S3_SECRET_ACCESS_KEY: string
		SUPABASE_S3_REGION: string
		SUPABASE_S3_ENDPOINT: string
		SMTP_HOST: string
		SMTP_PORT: string
		SMTP_SECURE: string
		SMTP_USER: string
		SMTP_PASS: string
	}
}

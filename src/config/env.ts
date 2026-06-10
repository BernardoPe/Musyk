import "dotenv/config"

const REQUIRED = ["TOKEN", "KEY", "ARL", "DATABASE_URL"] as const

const missing = REQUIRED.filter((name) => !process.env[name])
if (missing.length > 0) {
	throw new Error(`Missing required environment variables: ${missing.join(", ")} (see .env.example)`)
}

const env = {
	TOKEN: process.env.TOKEN!,
	KEY: process.env.KEY!,
	ARL: process.env.ARL!,
	DATABASE_URL: process.env.DATABASE_URL!,
	INVITE_LINK: process.env.INVITE_LINK,
	ADMINS: process.env.ADMINS ?? "",
	LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
	LOG_FILE: process.env.LOG_FILE,
} as const

export { env }

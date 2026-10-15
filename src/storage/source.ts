import { PrismaClient } from "@/generated/client/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { env } from "@/config/env.ts"

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
	adapter,
	log: ["error", "warn"],
	transactionOptions: {
		timeout: 5000,
		maxWait: 2000,
	},
})

process.on("beforeExit", async () => {
	await prisma.$disconnect()
	await pool.end()
})

// Docker stops containers with SIGTERM; Ctrl+C sends SIGINT.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.on(signal, async () => {
		await prisma.$disconnect()
		await pool.end()
		process.exit()
	})
}

export default prisma

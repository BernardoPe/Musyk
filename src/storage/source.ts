import { PrismaClient } from "../generated/client/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
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

process.on("SIGINT", async () => {
	await prisma.$disconnect()
	await pool.end()
	process.exit()
})

export default prisma

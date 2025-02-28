import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient().$extends(withAccelerate())

process.on("beforeExit", () => {
	prisma.$disconnect()
})

process.on("SIGINT", () => {
	prisma.$disconnect()
	process.exit()
})

export default prisma

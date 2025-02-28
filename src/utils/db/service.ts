import { Guild, User } from "discord.js"
import prisma from "./source.ts"
import { getOrCreateServerInfo } from "./server.ts"
import { getOrCreateUserInfo } from "./user.ts"

async function getCommandInfo(user: User, server: Guild) {
	return await prisma.$transaction(async () => {
		const userInfo = await getOrCreateUserInfo(user)
		const serverInfo = await getOrCreateServerInfo(server)
		return { userInfo, serverInfo }
	})
}

export { getCommandInfo }

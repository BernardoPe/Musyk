import { Guild, User } from "discord.js"
import prisma from "./source.ts"
import { userRepository } from "./repositories/user.ts"
import { serverRepository } from "./repositories/server.ts"

async function getCommandInfo(user: User, server: Guild) {
	return prisma.$transaction(
		async () => {
			const userInfo = await userRepository.getOrPut(user)
			const serverInfo = await serverRepository.getOrPut(server)
			return { userInfo, serverInfo }
		},
		{
			maxWait: 2000,
			timeout: 5000,
		}
	)
}

export { getCommandInfo }

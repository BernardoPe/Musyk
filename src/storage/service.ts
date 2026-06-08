import { Guild, User } from "discord.js"
import { userRepository } from "@/storage/repositories/user.ts"
import { serverRepository } from "@/storage/repositories/server.ts"

async function getCommandInfo(user: User, server: Guild) {
	const [userInfo, serverInfo] = await Promise.all([userRepository.getOrPut(user), serverRepository.getOrPut(server)])
	return { userInfo, serverInfo }
}

export { getCommandInfo }

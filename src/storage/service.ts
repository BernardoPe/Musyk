import { Guild, User } from "discord.js"
import { userRepository } from "@/storage/repositories/user.ts"
import { serverRepository } from "@/storage/repositories/server.ts"

import type { Config } from "@/types.ts"

async function resolveConfig(user: User, server: Guild): Promise<Config> {
	const [userInfo, serverInfo] = await Promise.all([userRepository.get(user), serverRepository.getOrPut(server)])
	return {
		prefix: serverInfo.prefix,
		lang: serverInfo.lang,
		playerConfig: userInfo.playerConfig || serverInfo.playerConfig,
	}
}

export { resolveConfig }

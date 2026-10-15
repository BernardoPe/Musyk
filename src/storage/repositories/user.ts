import { User } from "discord.js"
import prisma from "@/storage/source.ts"
import { CacheType, doCachedQuery, invalidateCache } from "@/storage/cache.ts"

import type { PlayerConfig } from "@/types.ts"

export interface UserInfo {
	userId: string
	playerConfig: PlayerConfig | null
}

class UserRepository {
	/**
	 * Users only have a row once they save their own settings, so a missing row is not
	 * created here: that would add a database write to every new user's first command.
	 */
	async get(user: User): Promise<UserInfo> {
		return await doCachedQuery(user.id, CacheType.User, -1, async () => {
			const existingUser = await prisma.user.findUnique({
				where: { userId: user.id },
				select: { userId: true, playerConfig: true },
			})
			const playerConfig = existingUser?.playerConfig
			return {
				userId: user.id,
				playerConfig: playerConfig
					? {
							searchEngine: playerConfig.searchEngine,
							volume: playerConfig.volume,
							leaveOnEnd: playerConfig.leaveOnEnd,
							leaveOnEndCooldown: playerConfig.leaveOnEndCooldown,
						}
					: null,
			}
		})
	}

	invalidateUserCache(userId: string): void {
		invalidateCache(userId, CacheType.User)
	}
}

export const userRepository = new UserRepository()

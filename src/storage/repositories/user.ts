import { User } from "discord.js"
import prisma from "@/storage/source.ts"
import { CacheType, doCachedQuery, invalidateCache } from "@/storage/cache.ts"

import type { PlayerConfig } from "@/types.ts"

export interface UserInfo {
	userId: string
	playerConfig: PlayerConfig | null
}

class UserRepository {
	async getOrPut(user: User): Promise<UserInfo> {
		return await doCachedQuery(user.id, CacheType.User, -1, async () => {
			const existingUser = await prisma.user.findUnique({
				where: { userId: user.id },
				select: { userId: true, playerConfig: true },
			})

			if (existingUser) {
				return {
					userId: existingUser.userId,
					playerConfig: existingUser.playerConfig
						? {
								searchEngine: existingUser.playerConfig.searchEngine,
								volume: existingUser.playerConfig.volume,
								leaveOnEnd: existingUser.playerConfig.leaveOnEnd,
								leaveOnEndCooldown: existingUser.playerConfig.leaveOnEndCooldown,
							}
						: null,
				}
			}

			const newUser = await prisma.user.create({
				data: { userId: user.id },
			})

			return {
				userId: newUser.userId,
				playerConfig: null,
			}
		})
	}

	invalidateUserCache(userId: string): void {
		invalidateCache(userId, CacheType.User)
	}
}

export const userRepository = new UserRepository()

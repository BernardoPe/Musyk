import { User } from "discord.js"
import prisma from "@/storage/source.ts"
import { CacheType, doCachedQuery, invalidateCache } from "@/storage/cache.ts"
import { DEFAULT_PLAYER_CONFIG } from "@/storage/constants/server.ts"

import type { SearchQueryType } from "discord-player"
import type { PlayerConfig, PlayerConfigUpdate } from "@/types.ts"

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

	async createPlayerConfig(user: User, config: Partial<PlayerConfigUpdate> = {}): Promise<void> {
		const finalConfig = { ...DEFAULT_PLAYER_CONFIG, ...config }

		await prisma.user.update({
			where: { userId: user.id },
			data: {
				playerConfig: {
					create: finalConfig,
				},
			},
		})

		this.invalidateUserCache(user.id)
	}

	async updatePlayerConfig(user: User, configUpdate: PlayerConfigUpdate): Promise<void> {
		const userInfo = await this.getOrPut(user)

		if (!userInfo.playerConfig) {
			await this.createPlayerConfig(user, configUpdate)
			return
		}

		await prisma.user.update({
			where: { userId: user.id },
			data: {
				playerConfig: {
					update: configUpdate,
				},
			},
		})

		this.invalidateUserCache(user.id)
	}

	async updateSearchEngine(user: User, searchEngine: SearchQueryType): Promise<void> {
		await this.updatePlayerConfig(user, { searchEngine })
	}

	async updateVolume(user: User, volume: number): Promise<void> {
		await this.updatePlayerConfig(user, { volume })
	}

	async updateLeaveOnEnd(user: User, leaveOnEnd: boolean): Promise<void> {
		await this.updatePlayerConfig(user, { leaveOnEnd })
	}

	async updateLeaveOnEndCooldown(user: User, leaveOnEndCooldown: number): Promise<void> {
		await this.updatePlayerConfig(user, { leaveOnEndCooldown })
	}

	async deletePlayerConfig(user: User): Promise<void> {
		await prisma.user.update({
			where: { userId: user.id },
			data: {
				playerConfig: {
					delete: true,
				},
			},
		})

		this.invalidateUserCache(user.id)
	}

	private invalidateUserCache(userId: string): void {
		invalidateCache(userId, CacheType.User)
	}
}

export const userRepository = new UserRepository()

import { Guild } from "discord.js"
import prisma from "@/storage/source.ts"
import { CacheType, doCachedQuery, invalidateCache } from "@/storage/cache.ts"
import { DEFAULT_PLAYER_CONFIG } from "@/storage/constants/server.ts"
import { MAX_PREFIX_LENGTH } from "@/constants.ts"
import { languageService } from "@/storage/services/language.ts"

import type { Language } from "@/langs"
import type { PlayerConfig } from "@/types.ts"

export interface ServerInfo {
	serverId: string
	prefix: string
	lang: Language
	playerConfig: PlayerConfig
}

type ServerRow = {
	serverId: string
	prefix: string
	lang: string
	playerConfig: PlayerConfig | null
}

class ServerRepository {
	async getOrPut(server: Guild): Promise<ServerInfo> {
		return await doCachedQuery(server.id, CacheType.Server, -1, async () => {
			const existingServer = await prisma.server.findUnique({
				where: { serverId: server.id },
				select: { serverId: true, prefix: true, lang: true, playerConfig: true },
			})

			if (existingServer?.playerConfig) {
				return this.toServerInfo(existingServer)
			}

			if (existingServer) {
				const repaired = await prisma.server.update({
					where: { serverId: server.id },
					data: { playerConfig: { create: { ...DEFAULT_PLAYER_CONFIG } } },
					include: { playerConfig: true },
				})
				return this.toServerInfo(repaired)
			}

			const newServer = await prisma.server.create({
				data: {
					serverId: server.id,
					playerConfig: { create: { ...DEFAULT_PLAYER_CONFIG } },
				},
				include: { playerConfig: true },
			})

			return this.toServerInfo(newServer)
		})
	}

	private async toServerInfo(row: ServerRow): Promise<ServerInfo> {
		const playerConfig = row.playerConfig ?? { ...DEFAULT_PLAYER_CONFIG }
		return {
			serverId: row.serverId,
			prefix: row.prefix,
			lang: await languageService.getLanguage(row.lang),
			playerConfig: {
				searchEngine: playerConfig.searchEngine,
				volume: playerConfig.volume,
				leaveOnEnd: playerConfig.leaveOnEnd,
				leaveOnEndCooldown: playerConfig.leaveOnEndCooldown,
			},
		}
	}

	async updatePrefix(server: Guild, prefix: string): Promise<void> {
		const trimmed = prefix.trim()
		if (trimmed.length === 0 || trimmed.length > MAX_PREFIX_LENGTH) {
			throw new Error(`Invalid prefix "${prefix}": must be 1-${MAX_PREFIX_LENGTH} characters`)
		}
		await prisma.server.update({
			where: { serverId: server.id },
			data: { prefix },
		})
		this.invalidateServerCache(server.id)
	}

	async updateLanguage(server: Guild, lang: string): Promise<void> {
		if (!languageService.has(lang)) {
			throw new Error(`Invalid language tag "${lang}"`)
		}
		await prisma.server.update({
			where: { serverId: server.id },
			data: { lang },
		})
		this.invalidateServerCache(server.id)
	}

	private invalidateServerCache(serverId: string): void {
		invalidateCache(serverId, CacheType.Server)
	}
}

export const serverRepository = new ServerRepository()

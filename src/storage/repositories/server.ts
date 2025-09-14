import { Guild } from "discord.js"
import { SearchQueryType } from "discord-player"
import prisma from "../source.ts"
import { CacheType, doCachedQuery, invalidateCache } from "../cache.ts"
import { DEFAULT_PLAYER_CONFIG } from "../constants/server.ts"
import { Language } from "../../langs"
import { languageService } from "../services/language.ts"

export interface PlayerConfig {
	searchEngine: string
	volume: number
	leaveOnEnd: boolean
	leaveOnEndCooldown: number
}

export interface ServerInfo {
	serverId: string
	prefix: string
	lang: Language
	playerConfig: PlayerConfig
}

export interface PlayerConfigUpdate {
	searchEngine?: SearchQueryType
	volume?: number
	leaveOnEnd?: boolean
	leaveOnEndCooldown?: number
}

class ServerRepository {
	async getOrPut(server: Guild): Promise<ServerInfo> {
		return await doCachedQuery(server.id, CacheType.Server, -1, async () => {
			const existingServer = await prisma.server.findUnique({
				where: { serverId: server.id },
				select: { serverId: true, prefix: true, lang: true, playerConfig: true },
			})

			if (existingServer?.playerConfig) {
				return {
					serverId: existingServer.serverId,
					prefix: existingServer.prefix,
					lang: await languageService.getLanguage(existingServer.lang),
					playerConfig: {
						searchEngine: existingServer.playerConfig.searchEngine,
						volume: existingServer.playerConfig.volume,
						leaveOnEnd: existingServer.playerConfig.leaveOnEnd,
						leaveOnEndCooldown: existingServer.playerConfig.leaveOnEndCooldown,
					},
				}
			}

			const newServer = await prisma.server.create({
				data: {
					serverId: server.id,
					playerConfig: { create: { ...DEFAULT_PLAYER_CONFIG } },
				},
				include: { playerConfig: true },
			})

			return {
				serverId: newServer.serverId,
				prefix: newServer.prefix,
				lang: await languageService.getLanguage(newServer.lang),
				playerConfig: {
					searchEngine: newServer.playerConfig!.searchEngine,
					volume: newServer.playerConfig!.volume,
					leaveOnEnd: newServer.playerConfig!.leaveOnEnd,
					leaveOnEndCooldown: newServer.playerConfig!.leaveOnEndCooldown,
				},
			}
		})
	}

	async updatePrefix(server: Guild, prefix: string): Promise<void> {
		await prisma.server.update({
			where: { serverId: server.id },
			data: { prefix },
		})
		this.invalidateServerCache(server.id)
	}

	async updateLanguage(server: Guild, lang: string): Promise<void> {
		await prisma.server.update({
			where: { serverId: server.id },
			data: { lang },
		})
		this.invalidateServerCache(server.id)
	}

	async updatePlayerConfig(server: Guild, configUpdate: PlayerConfigUpdate): Promise<void> {
		await prisma.server.update({
			where: { serverId: server.id },
			data: {
				playerConfig: {
					update: configUpdate,
				},
			},
		})
		this.invalidateServerCache(server.id)
	}

	async updateSearchEngine(server: Guild, searchEngine: SearchQueryType): Promise<void> {
		await this.updatePlayerConfig(server, { searchEngine })
	}

	async updateVolume(server: Guild, volume: number): Promise<void> {
		await this.updatePlayerConfig(server, { volume })
	}

	async updateLeaveOnEnd(server: Guild, leaveOnEnd: boolean): Promise<void> {
		await this.updatePlayerConfig(server, { leaveOnEnd })
	}

	async updateLeaveOnEndCooldown(server: Guild, leaveOnEndCooldown: number): Promise<void> {
		await this.updatePlayerConfig(server, { leaveOnEndCooldown })
	}

	private invalidateServerCache(serverId: string): void {
		invalidateCache(serverId, CacheType.Server)
	}
}

export const serverRepository = new ServerRepository()

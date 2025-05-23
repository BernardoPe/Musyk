import { Guild, Snowflake } from "discord.js"
import prisma from "./source.ts"
import { SearchQueryType } from "discord-player"
import { ServerPrefix } from "../types.ts"
import path from "path"
import { Language } from "../Langs"
import { getAllFiles } from "../Utils/Files/json.ts"
import { CacheType, doCachedQuery, invalidateCache } from "./cache.ts"

const defaultPlayerConfig = {
	searchEngine: "auto",
	volume: 100,
	leaveOnEnd: true,
	leaveOnEndCooldown: 300000,
}

async function getOrCreateServerInfo(server: Guild) {
	return await doCachedQuery(server.id, CacheType.Server, -1, async () => {
		const res = await prisma.server.findUnique({
			where: { serverId: server.id },
			select: { serverId: true, prefix: true, lang: true, playerConfig: true },
		})

		if (res) {
			return { ...res, lang: getLang(res.lang) }
		}

		const res2 = await prisma.server.create({
			data: {
				serverId: server.id,
				playerConfig: { create: { ...defaultPlayerConfig } },
			},
		})

		return { ...res2, lang: getLang(res2.lang), playerConfig: defaultPlayerConfig }
	})
}

async function updateServerPrefix(server: Guild, prefix: ServerPrefix) {
	await prisma.server.update({
		where: {
			serverId: server.id,
		},
		data: {
			prefix,
		},
	})
	invalidateCache(server.id, CacheType.Server)
}

async function updateServerLang(server: Guild, lang: string) {
	await prisma.server.update({
		where: {
			serverId: server.id,
		},
		data: {
			lang,
		},
	})
	invalidateCache(server.id, CacheType.Server)
}

async function updateServerSearchEngine(server: Guild, searchEngine: SearchQueryType) {
	await prisma.server.update({
		where: {
			serverId: server.id,
		},
		data: {
			playerConfig: {
				update: {
					searchEngine,
				},
			},
		},
	})
	invalidateCache(server.id, CacheType.Server)
}

async function updateServerVolume(server: Guild, volume: number) {
	await prisma.server.update({
		where: {
			serverId: server.id,
		},
		data: {
			playerConfig: {
				update: {
					volume,
				},
			},
		},
	})
	invalidateCache(server.id, CacheType.Server)
}

async function updateServerLeaveOnEnd(server: Guild, leaveOnEnd: boolean) {
	await prisma.server.update({
		where: {
			serverId: server.id,
		},
		data: {
			playerConfig: {
				update: {
					leaveOnEnd,
				},
			},
		},
	})
	invalidateCache(server.id, CacheType.Server)
}

async function updateServerLeaveOnEndCooldown(server: Guild, leaveOnEndCooldown: number) {
	await prisma.server.update({
		where: {
			serverId: server.id,
		},
		data: {
			playerConfig: {
				update: {
					leaveOnEndCooldown,
				},
			},
		},
	})
	invalidateCache(server.id, CacheType.Server)
}

const admins: Array<Snowflake> = (process.env.ADMINS || "").split(",")
const langs: { [key: string]: Language } = {};

(async () => {
	getAllFiles(path.join(__dirname, "../Langs"))
		.filter((file) => file.endsWith(".json"))
		.map((file) => require(file))
		.forEach((lang) => {
			langs[lang.tag] = lang
		})
})()

function getAdmins(): Array<Snowflake> {
	return admins
}

function getLang(tag: string): Language {
	return langs[tag]
}

process.on("beforeExit", () => {
	prisma.$disconnect()
})

process.on("SIGINT", () => {
	prisma.$disconnect()
	process.exit()
})

export {
	getOrCreateServerInfo,
	updateServerPrefix,
	updateServerLang,
	updateServerSearchEngine,
	updateServerVolume,
	getAdmins,
	getLang,
}

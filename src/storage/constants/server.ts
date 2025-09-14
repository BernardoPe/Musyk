import { SearchQueryType } from "discord-player"

export const DEFAULT_PLAYER_CONFIG = {
	searchEngine: "auto" as SearchQueryType,
	volume: 100,
	leaveOnEnd: true,
	leaveOnEndCooldown: 300000,
} as const

export const DEFAULT_SERVER_PREFIX = "!"
export const DEFAULT_LANGUAGE = "en"

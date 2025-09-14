import { SearchQueryType } from "discord-player"

export const DEFAULT_USER_PLAYER_CONFIG = {
	searchEngine: "auto" as SearchQueryType,
	volume: 100,
	leaveOnEnd: true,
	leaveOnEndCooldown: 300000,
} as const

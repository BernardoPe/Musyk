import { DiscordPlayerQueryResultCache, SearchResult } from "discord-player"
import { logger } from "@/utils/logger/logger.ts"

import type { Player, Playlist, QueryCacheProvider, QueryCacheResolverContext, Track } from "discord-player"

const EXPIRE_AFTER = 604_800_000 // 7 days

export class QueryCache implements QueryCacheProvider<CachedTrack> {
	public timer: NodeJS.Timeout
	public player!: Player
	private static readonly resultCache = new Map<string, DiscordPlayerQueryResultCache<CachedTrack>>()
	public checkInterval: number

	public constructor() {
		this.checkInterval = 60_000
		this.timer = setInterval(this.cleanupExpiredEntries, this.checkInterval)
	}

	private readonly cleanupExpiredEntries = () => {
		const now = Date.now()
		for (const [key, value] of QueryCache.resultCache.entries()) {
			if (value.expireAfter < now) {
				QueryCache.resultCache.delete(key)
			}
		}
	}

	private static cacheKey(queryType: string | null | undefined, value: string | null | undefined): string {
		return `${queryType}:${(value ?? "").toLowerCase()}`
	}

	public async getData(): Promise<DiscordPlayerQueryResultCache<CachedTrack>[]> {
		return Array.from(QueryCache.resultCache.values())
	}

	public async resolve(context: QueryCacheResolverContext): Promise<SearchResult> {
		const queryKey = QueryCache.cacheKey(context.queryType, context.query)
		const res = QueryCache.resultCache.get(queryKey)
		const tracks = res ? [res.data.track] : this.findTracksByAlias(context.query.toLowerCase())

		logger.info(`[CACHE]: Cache ${tracks.length > 0 ? "hit" : "miss"} for query ${context.query}`)

		return new SearchResult(this.player, {
			query: context.query,
			requestedBy: context.requestedBy,
			queryType: context.queryType,
			tracks,
			playlist: res?.data.playlist,
		})
	}

	private findTracksByAlias(query: string): Track[] {
		return Array.from(QueryCache.resultCache.values())
			.filter((cache) => cache.data.queryAliases.has(query))
			.map((cache) => cache.data.track)
	}

	public async addData(data: SearchResult) {
		if (data.hasPlaylist()) {
			QueryCache.resultCache.set(
				QueryCache.cacheKey(data.queryType, data.query),
				new DiscordPlayerQueryResultCache(
					{
						track: data.tracks[0],
						playlist: data.playlist,
						queryAliases: new Set([data.query.toLowerCase()]),
					},
					EXPIRE_AFTER
				)
			)
			return
		}

		const isURL = URL.canParse(data.query)
		data.tracks.forEach((trackData) => {
			const key = QueryCache.cacheKey(trackData.queryType, trackData.url)
			const existingCache = QueryCache.resultCache.get(key)
			if (isURL && !existingCache) {
				this.addToCache(trackData, undefined, new Set([data.query.toLowerCase()]))
			} else {
				const queryAliases = existingCache
					? existingCache.data.queryAliases.add(data.query.toLowerCase())
					: new Set([
							data.query.toLowerCase(),
							trackData.url.toLowerCase(),
							trackData.cleanTitle.toLowerCase(),
						])
				this.addToCache(trackData, trackData.playlist, queryAliases)
			}
		})
	}

	private addToCache(trackData: Track, playlist: Playlist | null | undefined, queryAliases: Set<string>): void {
		QueryCache.resultCache.set(
			QueryCache.cacheKey(trackData.queryType, trackData.url),
			new DiscordPlayerQueryResultCache({ track: trackData, playlist, queryAliases }, EXPIRE_AFTER)
		)
	}
}

type CachedTrack = {
	track: Track
	playlist: Playlist | null | undefined
	queryAliases: Set<string>
}

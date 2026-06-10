import { DiscordPlayerQueryResultCache, SearchResult, useMainPlayer } from "discord-player"
import { logger } from "@/utils/logger/logger.ts"

import type { Playlist, QueryCacheProvider, QueryCacheResolverContext, Track } from "discord-player"

const EXPIRE_AFTER = 604_800_000
const MAX_ENTRIES = 1_000

export class QueryCache implements QueryCacheProvider<CachedTrack> {
	public timer: NodeJS.Timeout
	private static readonly resultCache = new Map<string, DiscordPlayerQueryResultCache<CachedTrack>>()
	private static readonly aliasIndex = new Map<string, Set<string>>()
	public checkInterval: number

	public constructor() {
		this.checkInterval = 60_000
		this.timer = setInterval(this.cleanupExpiredEntries, this.checkInterval)
		this.timer.unref()
	}

	private readonly cleanupExpiredEntries = () => {
		const now = Date.now()
		for (const [key, value] of QueryCache.resultCache.entries()) {
			if (value.expireAfter < now) {
				QueryCache.deleteEntry(key, value)
			}
		}
	}

	private static cacheKey(queryType: string | null | undefined, value: string | null | undefined): string {
		return `${queryType}:${(value ?? "").toLowerCase()}`
	}

	private static deleteEntry(key: string, entry: DiscordPlayerQueryResultCache<CachedTrack>) {
		QueryCache.resultCache.delete(key)
		for (const alias of entry.data.queryAliases) {
			const keys = QueryCache.aliasIndex.get(alias)
			if (!keys) continue
			keys.delete(key)
			if (keys.size === 0) QueryCache.aliasIndex.delete(alias)
		}
	}

	private static setEntry(key: string, entry: DiscordPlayerQueryResultCache<CachedTrack>) {
		if (!QueryCache.resultCache.has(key) && QueryCache.resultCache.size >= MAX_ENTRIES) {
			const oldestKey = QueryCache.resultCache.keys().next().value
			if (oldestKey !== undefined) {
				QueryCache.deleteEntry(oldestKey, QueryCache.resultCache.get(oldestKey)!)
			}
		}
		QueryCache.resultCache.set(key, entry)
		for (const alias of entry.data.queryAliases) {
			let keys = QueryCache.aliasIndex.get(alias)
			if (!keys) {
				keys = new Set()
				QueryCache.aliasIndex.set(alias, keys)
			}
			keys.add(key)
		}
	}

	public async getData(): Promise<DiscordPlayerQueryResultCache<CachedTrack>[]> {
		return Array.from(QueryCache.resultCache.values())
	}

	public async resolve(context: QueryCacheResolverContext): Promise<SearchResult> {
		const queryKey = QueryCache.cacheKey(context.queryType, context.query)
		const res = QueryCache.resultCache.get(queryKey)
		const tracks = res ? [res.data.track] : this.findTracksByAlias(context.query.toLowerCase())

		logger.info(`[CACHE]: Cache ${tracks.length > 0 ? "hit" : "miss"} for query ${context.query}`)

		return new SearchResult(useMainPlayer(), {
			query: context.query,
			requestedBy: context.requestedBy,
			queryType: context.queryType,
			tracks,
			playlist: res?.data.playlist,
		})
	}

	private findTracksByAlias(query: string): Track[] {
		const keys = QueryCache.aliasIndex.get(query)
		if (!keys) return []
		const tracks: Track[] = []
		for (const key of keys) {
			const cached = QueryCache.resultCache.get(key)
			if (cached) tracks.push(cached.data.track)
		}
		return tracks
	}

	public async addData(data: SearchResult) {
		if (data.hasPlaylist()) {
			QueryCache.setEntry(
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
		QueryCache.setEntry(
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

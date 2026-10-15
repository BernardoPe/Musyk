import { DiscordPlayerQueryResultCache, Playlist, SearchResult, Track, useMainPlayer } from "discord-player"
import { logger } from "@/utils/logger/logger.ts"

import type { QueryCacheProvider, QueryCacheResolverContext } from "discord-player"
import type { User } from "discord.js"

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
		const requestedBy = context.requestedBy ?? null

		// Cached entries are templates: hand out fresh copies so every request gets its own
		// track ids and requester instead of sharing (and mutating) one Track across queues.
		const playlist = res?.data.playlist ? clonePlaylist(res.data.playlist, requestedBy) : undefined
		const tracks =
			playlist?.tracks ??
			(res ? [res.data.track] : this.findTracksByAlias(context.query.toLowerCase())).map((track) =>
				cloneTrack(track, requestedBy)
			)

		logger.info(`[CACHE]: Cache ${tracks.length > 0 ? "hit" : "miss"} for query ${context.query}`)

		return new SearchResult(useMainPlayer(), {
			query: context.query,
			requestedBy,
			queryType: context.queryType,
			tracks,
			playlist,
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
		// Text searches only ever play the top result; caching the rest just evicts useful entries.
		const tracks = isURL ? data.tracks : data.tracks.slice(0, 1)
		tracks.forEach((trackData) => {
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

function cloneTrack(track: Track, requestedBy: User | null, playlist = track.playlist): Track {
	const copy = new Track(track.player, {
		title: track.title,
		description: track.description,
		author: track.author,
		url: track.url,
		thumbnail: track.thumbnail,
		duration: track.duration,
		views: track.views,
		requestedBy,
		playlist,
		live: track.live,
		raw: track.raw,
		queryType: track.queryType ?? undefined,
		cleanTitle: track.cleanTitle,
		metadata: track.metadata,
		requestMetadata: () => track.requestMetadata(),
	})
	// The constructor escapes markdown in the title; the source title is already escaped.
	copy.title = track.title
	copy.description = track.description
	copy.extractor = track.extractor
	return copy
}

function clonePlaylist(playlist: Playlist, requestedBy: User | null): Playlist {
	const copy = new Playlist(playlist.player, {
		tracks: [],
		title: playlist.title,
		description: playlist.description,
		thumbnail: playlist.thumbnail,
		type: playlist.type,
		source: playlist.source,
		author: playlist.author,
		id: playlist.id,
		url: playlist.url,
		rawPlaylist: playlist.rawPlaylist,
	})
	copy.tracks = playlist.tracks.map((track) => cloneTrack(track, requestedBy, copy))
	return copy
}

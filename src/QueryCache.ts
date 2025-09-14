import {
	DiscordPlayerQueryResultCache,
	Player,
	Playlist,
	QueryCacheProvider,
	QueryCacheResolverContext,
	SearchResult,
	Track,
} from "discord-player"
import { logger } from "./utils/logger/logger.ts"

const EXPIRE_AFTER = 604_800_000 // 7 days

export class QueryCache implements QueryCacheProvider<CachedTrack> {
	public timer: NodeJS.Timeout
	public player!: Player
	private static readonly resultCache = new Map<string, DiscordPlayerQueryResultCache<CachedTrack>>()

	public constructor(public checkInterval: number = 60000) {
		this.timer = setInterval(this.cleanupExpiredEntries, this.checkInterval)
	}

	private readonly cleanupExpiredEntries = () => {
		const now = Date.now()
		// eslint-disable-next-line
        // @ts-ignore
		for (const [key, value] of QueryCache.resultCache.entries()) {
			if (value.expireAfter < now) {
				QueryCache.resultCache.delete(key)
			}
		}
	}

	public async getData(): Promise<DiscordPlayerQueryResultCache<CachedTrack>[]> {
		return Array.from(QueryCache.resultCache.values())
	}

	public async resolve(context: QueryCacheResolverContext): Promise<SearchResult> {
		const queryKey = context.query.toLowerCase()
		const res = QueryCache.resultCache.get(queryKey)
		const tracks = res ? [res.data.track] : this.findTracksByAlias(queryKey)

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
				data.query.toLowerCase(),
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
			const key = trackData.url.toLowerCase()
			if (isURL && !QueryCache.resultCache.has(key)) {
				this.addToCache(trackData, undefined, new Set([data.query.toLowerCase()]))
			} else {
				const existingCache = QueryCache.resultCache.get(key)
				const queryAliases = existingCache
					? existingCache.data.queryAliases.add(data.query.toLowerCase())
					: new Set([data.query.toLowerCase(), trackData.url, trackData.cleanTitle])
				this.addToCache(trackData, trackData.playlist, queryAliases)
			}
		})
	}

	private addToCache(trackData: Track, playlist: Playlist | null | undefined, queryAliases: Set<string>): void {
		QueryCache.resultCache.set(
			trackData.url.toLowerCase(),
			new DiscordPlayerQueryResultCache({ track: trackData, playlist, queryAliases }, EXPIRE_AFTER)
		)
	}
}

type CachedTrack = {
    track: Track;
    playlist: Playlist | null | undefined;
    queryAliases: Set<string>;
};

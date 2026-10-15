import { QueueRepeatMode } from "discord-player"
import { SpotifyExtractor } from "discord-player-spotify"
import { YoutubeExtractor } from "discord-player-youtubei"
import { logger } from "@/utils/logger/logger.ts"

import type { ExtractorStreamable, GuildQueue, Track } from "discord-player"
import type { Readable } from "node:stream"

type Prefetch = { track: Track; stream: Promise<ExtractorStreamable | null> }

const prefetches = new WeakMap<GuildQueue, Prefetch>()

/**
 * Only YouTube streams are prefetched: they hold no connection open while waiting (patched
 * simple-ytdl-core) and SABR streams survived 5 minutes idle in testing. Other sources may
 * drop an idle connection and then stall when playback finally reads them.
 */
const YOUTUBE = YoutubeExtractor.identifier
const PREFETCHABLE = new Set([YOUTUBE, SpotifyExtractor.identifier])

function destroy(stream: ExtractorStreamable | null) {
	if (!stream || typeof stream === "string") return
	const readable: Readable = "stream" in stream ? stream.stream : stream
	readable.destroy()
}

function discard(queue: GuildQueue) {
	const entry = prefetches.get(queue)
	if (!entry) return
	prefetches.delete(queue)
	void entry.stream.then(destroy)
}

function nextTrack(queue: GuildQueue): Track | null {
	if (queue.repeatMode === QueueRepeatMode.TRACK) return queue.currentTrack
	return queue.tracks.at(0) ?? (queue.repeatMode === QueueRepeatMode.QUEUE ? queue.currentTrack : null)
}

async function extract(track: Track): Promise<ExtractorStreamable | null> {
	const stream = await track.extractor!.stream(track)
	// Spotify tracks are bridged; keep the stream only if YouTube served it.
	if (track.extractor!.identifier !== YOUTUBE && track.bridgedExtractor?.identifier !== YOUTUBE) {
		destroy(stream)
		return null
	}
	return stream
}

/** Starts extracting the stream of `track`, replacing a stale prefetch for another track. */
function prefetchTrack(queue: GuildQueue, track: Track | null) {
	const current = prefetches.get(queue)
	if (current?.track === track) return
	discard(queue)
	if (!track?.extractor || !PREFETCHABLE.has(track.extractor.identifier)) return

	const stream = extract(track).catch((error) => {
		logger.debug(`[PREFETCH]: ${track.url} failed: ${error instanceof Error ? error.message : error}`)
		return null
	})
	prefetches.set(queue, { track, stream })
}

/** Starts extracting the stream of the track that will play next. */
function prefetchNext(queue: GuildQueue) {
	prefetchTrack(queue, nextTrack(queue))
}

/**
 * `onBeforeCreateStream` hook: hands over the prefetched stream when it belongs to the track
 * about to play. Never rejects, since a rejection would fail the track.
 */
async function takePrefetched(queue: GuildQueue, track: Track): Promise<Readable | null> {
	const entry = prefetches.get(queue)
	// A mismatch (e.g. a seek replaying the current track) leaves the prefetch for later.
	if (entry?.track !== track) return null
	prefetches.delete(queue)
	// discord-player accepts any extractor stream here even though the hook is typed Readable.
	return (await entry.stream) as Readable | null
}

export { prefetchNext, prefetchTrack, takePrefetched, discard as discardPrefetch }

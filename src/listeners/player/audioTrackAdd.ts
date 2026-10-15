import { GuildQueue, GuildQueueEvent, RawTrackData, Track } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { songQueuedEmbed } from "@/embeds/player/queue.ts"
import { sendEmbed } from "@/embeds/channels.ts"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import { prefetchNext } from "@/handlers/prefetch.ts"
import { serverRepository } from "@/storage/repositories/server.ts"
import { EMBED_TIMEOUT_LONG_MS } from "@/constants.ts"

class AudioTrackAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.AudioTrackAdd

	public async execute(queue: GuildQueue<QueueMetadata>, track: Track<RawTrackData>) {
		if (queue.isPlaying()) prefetchNext(queue)
		if (!queue.isPlaying()) return

		const server = await serverRepository.getOrPut(queue.guild)

		if (queue.isPlaying()) refreshPlayer(queue, server.lang)

		const embed = songQueuedEmbed(track, queue, server.lang)

		void sendEmbed(queue.metadata.textChannel!, { embeds: [embed] }, EMBED_TIMEOUT_LONG_MS)
	}
}

export default new AudioTrackAddHandler()

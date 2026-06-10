import { GuildQueue, GuildQueueEvent, Track } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { queuePlaylistEmbed } from "@/embeds/player/queue.ts"
import { sendEmbed } from "@/embeds/channels.ts"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import { serverRepository } from "@/storage/repositories/server.ts"
import { EMBED_TIMEOUT_LONG_MS } from "@/constants.ts"

class AudioTracksAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.AudioTracksAdd

	public async execute(queue: GuildQueue<QueueMetadata>, tracks: Track[]) {
		const server = await serverRepository.getOrPut(queue.guild)

		const embed = queuePlaylistEmbed(tracks[0].playlist!, server.lang)

		if (queue.isPlaying()) refreshPlayer(queue, server.lang)

		void sendEmbed(queue.metadata.textChannel!, { embeds: [embed] }, EMBED_TIMEOUT_LONG_MS)
	}
}

export default new AudioTracksAddHandler()

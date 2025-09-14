import { GuildQueue, GuildQueueEvent, Track } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { queuePlaylistEmbed } from "../../embeds/player/queue.ts"
import { sendEmbed } from "../../embeds/channels.ts"
import { updatePlayer } from "../../embeds/player/playing.ts"
import { serverRepository } from "../../storage/repositories/server.ts"

class AudioTracksAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.AudioTracksAdd

	public async execute(queue: GuildQueue<QueueMetadata>, tracks: Track[]) {
		const server = await serverRepository.getOrPut(queue.guild)

		const embed = queuePlaylistEmbed(tracks[0].playlist!, server.lang)

		if (queue.isPlaying()) updatePlayer(queue, server.lang)

		sendEmbed(queue.metadata.textChannel!, { embeds: [embed] }, 60000)
	}
}

export default new AudioTracksAddHandler()

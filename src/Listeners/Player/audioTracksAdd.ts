import { GuildQueue, GuildQueueEvent, Track } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { queuePlaylistEmbed } from "../../Embeds/Player/queue.ts"
import { sendEmbed } from "../../Embeds/channels.ts"
import { updatePlayer } from "../../Embeds/Player/playing.ts"
import { getOrCreateServerInfo } from "../../Storage/server.ts"

class AudioTracksAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.AudioTracksAdd

	public async execute(queue: GuildQueue<QueueMetadata>, tracks: Track[]) {
		const server = await getOrCreateServerInfo(queue.guild)

		const embed = queuePlaylistEmbed(tracks[0].playlist!, server.lang)

		if (queue.isPlaying()) updatePlayer(queue, server.lang)

		sendEmbed(queue.metadata.textChannel!, { embeds: [embed] }, 60000)
	}
}

export default new AudioTracksAddHandler()

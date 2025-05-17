import { GuildQueue, GuildQueueEvent, RawTrackData, Track } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { songQueuedEmbed } from "../../Embeds/Player/queue.ts"
import { sendEmbed } from "../../Embeds/channels.ts"
import { updatePlayer } from "../../Embeds/Player/playing.ts"
import { getOrCreateServerInfo } from "../../Storage/server.ts"

class AudioTrackAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.AudioTrackAdd

	public async execute(queue: GuildQueue<QueueMetadata>, track: Track<RawTrackData>) {
		if (!queue.isPlaying()) return

		const server = await getOrCreateServerInfo(queue.guild)

		if (queue.isPlaying()) updatePlayer(queue, server.lang)

		const embed = songQueuedEmbed(track, queue, server.lang)

		sendEmbed(queue.metadata.textChannel!, { embeds: [embed] }, 60000)
	}
}

export default new AudioTrackAddHandler()

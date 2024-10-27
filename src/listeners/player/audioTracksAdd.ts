import {GuildQueue, GuildQueueEvent, Track} from "discord-player"
import {updatePlayer, queuePlaylistEmbed, sendEmbed} from "../../utils/embeds.ts"
import {GuildQueueEventHandler, QueueMetadata} from "../../types.ts"

class AudioTracksAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.audioTracksAdd

	public async execute(queue: GuildQueue<QueueMetadata>, tracks: Track[]) {
		const embed = queuePlaylistEmbed(tracks[0].playlist!)

		if (queue.isPlaying()) updatePlayer(queue)

		await sendEmbed(queue.metadata.textChannel!, {embeds: [embed]}, 60000)
	}
}

export default new AudioTracksAddHandler()
import { GuildQueue, GuildQueueEvent, Track } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { queuePlaylistEmbed } from "../../utils/embeds/player/queue.ts"
import { sendEmbed } from "../../utils/embeds/channels.ts"
import { updatePlayer } from "../../utils/embeds/player/playing.ts"
import { getLang } from "../../utils/configs/server.ts"

class AudioTracksAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.AudioTracksAdd

	public execute(queue: GuildQueue<QueueMetadata>, tracks: Track[]) {
		const lang = getLang(queue.guild.id)

		const embed = queuePlaylistEmbed(tracks[0].playlist!, lang)

		if (queue.isPlaying()) updatePlayer(queue, lang)

		sendEmbed(queue.metadata.textChannel!, { embeds: [embed] }, 60000)
	}
}

export default new AudioTracksAddHandler()

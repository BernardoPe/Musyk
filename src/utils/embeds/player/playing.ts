import { Colors, EmbedBuilder, Snowflake } from "discord.js"
import { GuildQueue, RawTrackData, Track } from "discord-player"
import { QueueMetadata } from "../../../types.ts"
import { Language } from "../../../langs"

function getEmoji(source: string, embed?: EmbedBuilder): string {
	let emoji: Snowflake
	if (source.includes("youtube")) {
		emoji = "<:YouTube1:1124140924876902411>"
		embed?.setColor(Colors.Red)
	} else if (source.includes("spotify")) {
		emoji = "<:SpotifyLogo:1124141017260634262>"
		embed?.setColor(Colors.Green)
	} else {
		emoji = "<:4678_SoundCloud:1124303937017745469>"
		embed?.setColor(Colors.Orange)
	}
	return emoji
}

function updatePlayer(queue: GuildQueue<QueueMetadata>, lang: Language) {
	const embed = nowPlayingEmbed(queue, lang)

	if (!queue.metadata.playerEmbed || queue.metadata.updatingPlayer || !queue.metadata.playerEmbed.editable) {
		return
	}

	queue.metadata.updatingPlayer = true // Prevents unnecessary concurrent updates

	const data = queue.metadata.playerEmbed

	data.edit({
		embeds: [embed],
	}).finally(() => {
		queue.metadata.updatingPlayer = false
	})
}

function nowPlayingEmbed(queue: GuildQueue, lang: Language): EmbedBuilder {
	const embed = new EmbedBuilder()
	const emoji = getEmoji(queue.currentTrack!.source, embed)
	const song: Track<RawTrackData> = queue.currentTrack as Track<RawTrackData>

	embed
		.setTitle(lang.embeds.now_playing.title)
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
		.addFields(
			{
				name: lang.embeds.now_playing.fields.duration,
				value: `${song.metadata!.live ? "Live" : song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{
				name: lang.embeds.now_playing.fields.requested_by,
				value: `${song.requestedBy}`,
				inline: true,
			},
			{
				name: lang.embeds.now_playing.fields.volume,
				value: `${queue.node.volume}%`,
				inline: true,
			}
		)

	if (queue.history.nextTrack) {
		embed.addFields(
			{
				name: lang.embeds.now_playing.fields.songs_in_queue,
				value: `${queue.size}`,
				inline: true,
			},
			{
				name: lang.embeds.now_playing.fields.duration,
				value: `${queue.durationFormatted}`,
				inline: true,
			},
			{
				name: lang.embeds.now_playing.fields.next_track,
				value: `${getEmoji(queue.history.nextTrack.source)} **[${
					queue.history.nextTrack.cleanTitle
				}](${queue.history.nextTrack.url})**`,
				inline: true,
			}
		)
	}
	return embed
}

export { getEmoji, updatePlayer, nowPlayingEmbed }

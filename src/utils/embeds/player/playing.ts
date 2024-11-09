import { Colors, EmbedBuilder, Snowflake } from "discord.js"
import { GuildQueue, RawTrackData, Track } from "discord-player"
import { QueueMetadata } from "../../../types.ts"

function getEmoji(source: string, embed: EmbedBuilder): string {
	let emoji: Snowflake
	if (source.includes("youtube")) {
		emoji = "<:YouTube1:1124140924876902411>"
		if (embed) embed.setColor(Colors.Red)
	} else if (source.includes("spotify")) {
		emoji = "<:SpotifyLogo:1124141017260634262>"
		if (embed) embed.setColor(Colors.Green)
	} else {
		emoji = "<:4678_SoundCloud:1124303937017745469>"
		if (embed) embed.setColor(Colors.Orange)
	}
	return emoji
}

function updatePlayer(queue: GuildQueue<QueueMetadata>) {
	const embed = nowPlayingEmbed(queue)

	if (
		!queue.metadata.playerEmbed ||
        queue.metadata.updatingPlayer ||
        !queue.metadata.playerEmbed.editable
	) {
		return
	}

	queue.metadata.updatingPlayer = true // Prevents unnecessary concurrent updates

	const data = queue.metadata.playerEmbed

	data.edit({
		embeds: [embed],
	}).then(() => {
		queue.metadata.updatingPlayer = false
	})
}

function nowPlayingEmbed(queue: GuildQueue): EmbedBuilder {
	const embed = new EmbedBuilder()
	const emoji = getEmoji(queue.currentTrack!.source, embed)
	const song: Track<RawTrackData> = queue.currentTrack as Track<RawTrackData>

	embed
		.setTitle("Now Playing")
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
		.addFields(
			{
				name: "Duration",
				value: `${song.metadata!.live ? "Live" : song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{
				name: "Requested By",
				value: `${song.requestedBy}`,
				inline: true,
			},
			{ name: "Volume", value: `${queue.node.volume}%`, inline: true }
		)

	if (queue.history.nextTrack) {
		embed.addFields(
			{ name: "Songs in queue", value: `${queue.size}`, inline: true },
			{
				name: "Total queue duration",
				value: `${queue.durationFormatted}`,
				inline: true,
			},
			{
				name: "Next Track",
				value: `${getEmoji(queue.history.nextTrack.source, embed)} **[${
					queue.history.nextTrack.cleanTitle
				}](${queue.history.nextTrack.url})**`,
				inline: true,
			}
		)
	}
	return embed
}

export { getEmoji, updatePlayer, nowPlayingEmbed }

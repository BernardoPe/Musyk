import { Colors, EmbedBuilder } from "discord.js"
import { GuildQueue, Playlist, RawTrackData, Track } from "discord-player"
import { QueueMetadata } from "../../../types.ts"
import { getEmoji } from "./playing.ts"

function leavingEmbed(): EmbedBuilder {
	return new EmbedBuilder()
		.setDescription("Queue is empty, leaving in 5 minutes...")
		.setColor(Colors.Red)
}

function createQueueEmbed(serverQueue: GuildQueue): EmbedBuilder[] {
	const pages: EmbedBuilder[] = []
	const tracks = serverQueue.tracks.toArray()

	let size = 0
	let page = 1

	while (size < tracks.length) {
		const embed = new EmbedBuilder()
		const curr = serverQueue.currentTrack!
		const duration = `(${curr.duration.padStart(5, "0")})`

		embed
			.setTitle(`Current Queue Page ${page}`)
			.addFields({
				name: "Currently playing",
				value: `[${curr.cleanTitle}](${curr.url}) ${duration}`,
			})
			.setDescription(null)
			.setColor(Colors.Blue)

		for (let i = 0; i < 10 && size < tracks.length; i++) {
			const song = tracks[size]
			const duration = `(${song.duration.padStart(5, "0")})`
			embed.addFields({
				name: `Position ${size + 1}:`,
				value: `[${song.cleanTitle}](${song.url}) ${duration}`,
			})
			size++
		}

		embed.addFields(
			{
				name: "Total Queue Duration",
				value: `${serverQueue.durationFormatted}`,
				inline: true,
			},
			{
				name: "Songs in Queue",
				value: `${serverQueue.size}`,
				inline: true,
			}
		)

		pages.push(embed)
		page++
	}

	return pages
}

function queuePlaylistEmbed(playlist: Playlist): EmbedBuilder {
	const type = playlist.tracks[0].source
	const embed = new EmbedBuilder()
	const emoji = getEmoji(type, embed)

	const thumbnail = playlist.thumbnail.includes("null")
		? playlist.tracks[0].thumbnail
		: playlist.thumbnail

	embed
		.setTitle("Playlist Queued")
		.setDescription(`${emoji} **[${playlist.title}](${playlist.url})**`)
		.setThumbnail(`${thumbnail}`)
		.addFields(
			{ name: "Songs", value: `${playlist.tracks.length}`, inline: true },
			{
				name: "Duration",
				value: `${playlist.durationFormatted}`,
				inline: true,
			}
		)

	return embed
}

function songQueuedEmbed(
	song: Track<RawTrackData>,
	queue: GuildQueue<QueueMetadata>
): EmbedBuilder {
	const type = song.source
	const embed = new EmbedBuilder()
	const emoji = getEmoji(type, embed)
	embed
		.setTitle("Song Queued")
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
		.addFields(
			{
				name: "Duration",
				value: `${song.metadata!.live ? "Live" : song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{
				name: "Queue Position",
				value: `${queue.size}`,
				inline: true,
			},
			{
				name: "Requested By",
				value: `${song.requestedBy}`,
				inline: true,
			}
		)

	return embed
}

export { createQueueEmbed, queuePlaylistEmbed, songQueuedEmbed, leavingEmbed }

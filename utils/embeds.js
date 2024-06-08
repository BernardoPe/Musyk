const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require("discord.js")

const { Util } = require("discord-player")
const config = require("../config.json")

const botID = config.botID
const inviteLink = config.inviteLink

function createLink() {
	const link = new ButtonBuilder()
		.setLabel("Invite Link")
		.setURL(inviteLink)
		.setStyle(ButtonStyle.Link)

	const row1 = new ActionRowBuilder().addComponents(link)

	return row1
}

function helpEmbeds() {
	let embed1 = new EmbedBuilder()
		.setAuthor({
			name: "Syken",
			url: "https://discord.com/users/259810801219534849",
			iconURL:
				"https://cdn.discordapp.com/avatars/259810801219534849/9a98973995330392dd7ed83feac84106.webp",
		})
		.setTitle("Musyk - A Music Bot")
		.setDescription(
			"Musyk is a Discord bot that allows you to play music on your server.\n\n" +
				" With Musyk, you can play music from Youtube, Spotify, and SoundCloud.",
		)
		.setColor(0x58b9ff)

	let embed2 = new EmbedBuilder()
		.setTitle("Command List")
		.setDescription(
			"Musyk commands start with the default prefix '.'. This prefix can be changed with the slash command '/prefix'. Available commands are listed below.\n\n" +
				"**/prefix <new prefix> ** : Set a new command prefix for this server. If 'current' or 'curr' is provided this command will display the current prefix. \n\n" +
				"**.play <song name / url>** : Play a song/playlist or add it to the music queue.\n\n" +
				"**.stop**: Stop the current playback and clear the music queue.\n\n" +
				"**.skip**: Skip the currently playing song and play the next song in the queue.\n\n" +
				"**.pause**: Pause the current playback.\n\n" +
				"**.resume**: Resume the paused playback.\n\n" +
				"**.queue**: Shows the current song queue.\n\n" +
				//"**.seek <timestamp>**: skip or rewind to a timestamp in the song. Format is hh:mm:ss, (zero values before first non-zero value can be omitted)\n\n" +
				"**.volume <volume>**: Adjust the volume of the playback. If no arguments are provided shows current volume \n\n" +
				"**.remove <Queue Position>**: Remove a specific song from the music queue.\n\n" +
				"**.shuffle**: Shuffle the order of songs in the music queue.\n\n" +
				"**.skipto <Queue Position>**: Skip to a specific song in the music queue. Removes all the songs between the current one and the specified one from the queue.\n\n" +
				"**.reverse**: Reverses the queue priority.\n\n" +
				"**.jump <Queue Position>**: Jump to a specific position in the queue. Keeps all the songs between the current one and the specified one from the queue.\n\n" +
				"**.cycle <mode>**: Toggle the repeat mode for the music queue. Available options are 'off' for no repetition, 'track' for current track repetition, 'queue' for queue cycling, and 'autoplay for auto-search after the queue ends.",
		)

		.setColor(0x58b9ff)

	let embed3 = new EmbedBuilder()
		.setTitle("Play Buttons")
		.addFields(
			{ name: "⏭️", value: "Skips the current song" },
			{ name: "⏯️", value: "Pauses/Resumes the player" },
			{ name: "⏹️", value: "Stops playback and clears the music queue" },
			{ name: "🔊", value: "Increases volume by 20%" },
			{ name: "🔉", value: "Decreases volume by 20%" },
			{ name: "🔀", value: "Shuffles the current queue" },
			{ name: "🔃", value: "Reverses the current queue" },
			{ name: "🕒", value: "Shows the current queue" },
			{ name: "🔄", value: "Toggles current track cycling" },
			{ name: "🤖", value: "Toggles autoplay" },
		)
		.setColor(0x58b9ff)

	//let embed4 = new EmbedBuilder()
	//    .setTitle('Play Filters')
	//    .setDescription("Through the **.filter <filter>** command, you can set filters for the audio player.\n\n"
	//                    + "Available filters are: bassboost, 8D, vaporwave, nightcore, phaser, tremolo, vibrato, reverse, treble, normalizer, normalizer2, surrounding, pulsator, subboost, karaoke, flanger, gate, hass, mcompand, mono, mstlr, mstrr, compress, expander, softlimiter, chorus, chorus2d, chorus3d, fadein, dim, and lofi.\n\n"
	//                    + "If you pass 'disableall' as the argument, all filters will be disabled.")
	//    .setColor(0x58b9ff);
	//

	let embed5 = new EmbedBuilder()
		.setTitle("Aditional Information")
		.setDescription("Make sure Musyk has the necessary permissions to join voice channels and manage music playback.")
		.setColor(0x58b9ff)

	return [embed1, embed2, embed3, embed5]
}

function createButtons() {
	const commands = [
		"skip",
		"pause",
		"stop",
		"increaseVolume",
		"decreaseVolume",
		"shuffle",
		"reverse",
		"queue",
		"cycle",
		"autoplay",
	]
	const emojis = ["⏭️", "⏯️", "⏹️", "🔊", "🔉", "🔀", "🔃", "🕒", "🔄", "🤖"]

	const rows = Array(Math.floor(commands.length / 5))

	for (let i = 0; i < rows.length; i++) {
		rows[i] = new ActionRowBuilder()
	}

	for (let i = 0; i < commands.length; i++) {
		const button = new ButtonBuilder()
			.setCustomId(commands[i])
			.setEmoji(emojis[i])
			.setStyle(ButtonStyle.Secondary)

		rows[Math.floor(i / 5)].addComponents(button)
	}

	return rows
}

function getEmoji(source, embed) {
	let emoji

	if (source.includes("youtube")) {
		emoji = "<:YouTube1:1124140924876902411>"
		embed ? embed.setColor(0xed4245) : embed
	} else if (source.includes("spotify")) {
		emoji = "<:SpotifyLogo:1124141017260634262>"
		embed ? embed.setColor(0x57f287) : embed
	} else {
		emoji = "<:4678_SoundCloud:1124303937017745469>"
		embed ? embed.setColor(0xe67e22) : embed
	}
	return emoji
}

function createQueueEmbed(serverQueue) {
	var pages = []
	let tracks = serverQueue.tracks.toArray()

	let size = 0
	let page = 1

	while (size < tracks.length) {
		let embed = new EmbedBuilder()
		let curr = serverQueue.currentTrack
		let duration = `(${curr.duration.padStart(5, "0")})`

		embed
			.setTitle(`Current Queue Page ${page}`)
			.addFields({
				name: "Currently playing",
				value: `[${curr.cleanTitle}](${curr.url}) ${duration}`,
			})
			.setDescription(null)
			.setColor(0x01ff34)

		for (let i = 0; i < 10 && size < tracks.length; i++) {
			let song = tracks[size]
			let duration = `(${song.duration.padStart(5, "0")})`
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
			{ name: "Songs in Queue", value: `${serverQueue.size}`, inline: true },
		)

		pages.push(embed)
		page++
	}

	return pages
}

function queuePlaylistEmbed(playlist) {
	let type = playlist.tracks[0].source
	let embed = new EmbedBuilder()
	let emoji = getEmoji(type, embed)

	let thumbnail

	if (!playlist.thumbnail.includes("null")) thumbnail = playlist.thumbnail
	else thumbnail = playlist.tracks[0].thumbnail

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
			},
		)

	return embed
}

function nowPlayingEmbed(queue) {
	let embed = new EmbedBuilder()
	let emoji = getEmoji(queue.currentTrack.source, embed)

	let song = queue.currentTrack
	embed
		.setTitle("Now Playing")
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
	if (queue.history.nextTrack) {
		embed.addFields(
			{
				name: "Duration",
				value: `${song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{ name: "Requested By", value: `${song.requestedBy}`, inline: true },
			{ name: "Songs in queue", value: `${queue.size}`, inline: true },
			{
				name: "Total queue duration",
				value: `${queue.durationFormatted}`,
				inline: true,
			},
			{
				name: "Next Track",
				value: `${getEmoji(queue.history.nextTrack.source)} **[${
					queue.history.nextTrack.cleanTitle
				}](${queue.history.nextTrack.url})**`,
				inline: true,
			},
			{
				name: "Volume",
				value: `${queue.node.volume}%`,
				inline: true,
			},
		)
	} else {
		embed.addFields(
			{
				name: "Duration",
				value: `${song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{ name: "Requested By", value: `${song.requestedBy}`, inline: true },
			{ name: "Volume", value: `${queue.node.volume}%`, inline: true },
		)
	}

	return embed
}

function songQueuedEmbed(song, queue) {
	let type = song.source
	let embed = new EmbedBuilder()
	let emoji = getEmoji(type, embed)

	embed
		.setTitle("Song Queued")
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
		.addFields(
			{
				name: "Duration",
				value: `${song.duration.padStart(5, "0")}`,
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
			},
		)

	return embed
}

async function updatePlayer(queue) {
	let embed = nowPlayingEmbed(queue)
	let buttons = createButtons()

	while (!queue.metadata[2]) await Util.wait(100)

	const data = queue.metadata[2]

	data.edit({
		components: buttons,
		embeds: [embed],
	})
}

async function sendEmbed(channel, info, timeout) {
	if (!channel) return
	let bot = channel.members.get(botID) // replace with your bot id
	if (!bot) return
	if (!channel.permissionsFor(bot).has("SendMessages")) return
	if (!timeout) return channel.send(info)

	return channel.send(info).then(async (msg) => {
		await Util.wait(timeout)
		msg.delete()
	})
}

module.exports = {
	sendEmbed,
	updatePlayer,
	createButtons,
	getEmoji,
	queuePlaylistEmbed,
	nowPlayingEmbed,
	songQueuedEmbed,
	helpEmbeds,
	createLink,
	createQueueEmbed,
}

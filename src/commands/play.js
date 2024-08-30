const { sendEmbed, errorEmbed} = require("../utils/embeds")

const searchEngines = {
	"-sp": "spotifySearch",
	"-yt": "youtube",
	"-sc": "soundcloudSearch"
}

module.exports = {
	aliases: ["p", "play"],
	name: "play",
	execute: async (msg, args, bot) => {

		if (args.length === 1) {
			const embed = errorEmbed(undefined, "Please provide a search query")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		const voiceChannel = msg.member.voice.channel

		if (!voiceChannel) {
			const embed = errorEmbed(undefined, "You need to be in a voice channel to play music")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		const permissions = voiceChannel.permissionsFor(msg.client.user)

		if (!permissions.has("Connect") || !permissions.has("Speak")) {
			const embed = errorEmbed(undefined, "I need the permissions to join and speak in your voice channel")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		const guildQueue = bot.player.nodes.get(msg.guild.id)

		let queue = guildQueue
			? guildQueue
			: await bot.player.nodes.create(msg.guild, {
				bufferingTimeout: 20000,
				leaveOnEmpty: false,
				leaveOnEnd: true,
				leaveOnEndCooldown: 300000,
			})

		try {
			if (!queue.connection) await queue.connect(voiceChannel)
			else if (queue.channel !== msg.member.voice.channel) {
				const embed = errorEmbed(undefined, "Already connected to a different voice channel")
				return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
			}
		} catch (error) {
			bot.player.nodes.delete(msg.guild.id)
			return console.log(error)
		}

		args.shift() // Remove the command from the args

		let searchArg = args.find(arg => searchEngines[arg] !== undefined)
		let searchEngine = searchEngines[searchArg] || "auto"

		args = args.filter(arg => searchEngines[arg] === undefined)

		const str = args.filter(arg => arg.trim() !== "").join(" ")

		const result = await bot.player.search(str, {
			requestedBy: msg.author,
			searchEngine: searchEngine,
		})
		
		let song = result.tracks[0]

		try {
			if (result.tracks.length === 0) throw new Error("No results found")

			if (!queue.isPlaying() && !queue.dispatcher.isBuffering()) {
				queue.setMetadata(
					{
						"voiceChannel": voiceChannel,
						"textChannel": msg.channel,
					}
				)
				await queue.play(song)
			} else if (!result.playlist) {
				queue.addTrack(song)
			} else {
				queue.addTrack(result.playlist)
			}
		} catch (e) {
			console.log(e)
			const embed = errorEmbed(undefined, "No results found or an error occurred")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
	},
}

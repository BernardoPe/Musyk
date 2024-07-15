const { QueueRepeatMode } = require("discord-player")
const { sendEmbed } = require("../utils/embeds.js")

module.exports = {
	aliases: ["cycle"],
	name: "cycle",
	requiresPlayer: true,
	async execute(msg, args, embed, bot, serverQueue) {
		let md = "none"
		let mode = undefined

		switch (args[1]) {
		case "off":
			serverQueue.setRepeatMode(QueueRepeatMode.OFF)
			mode = "Turned off loop mode."
			break
		case "track":
			serverQueue.setRepeatMode(QueueRepeatMode.TRACK)
			mode = "Repeating track activated"
			break
		case "queue":
			serverQueue.setRepeatMode(QueueRepeatMode.QUEUE)
			mode = "Looping queue enabled."
			break
		case "autoplay":
			serverQueue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
			mode = "Autoplay mode activated."
			break
		default:
			if (serverQueue.repeatMode === QueueRepeatMode.AUTOPLAY) {
				md = "autoplay"
			} else if (serverQueue.repeatMode === QueueRepeatMode.QUEUE) {
				md = "queue"
			} else if (serverQueue.repeatMode === QueueRepeatMode.TRACK) {
				md = "track"
			} else if (serverQueue.repeatMode === QueueRepeatMode.OFF) {
				md = "off"
			}
			embed.setDescription(`Loop mode is set to: \`${md}\`.`)
		}
		if (mode) embed.setDescription(mode)
		await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}

const { sendEmbed } = require("../utils/embeds")
const { validateTimestamp, millisecondsToTimestamp } = require("../utils/time")

module.exports = {
	aliases: ["seek"],
	name: "seek",
	requiresPlayer: true,
	async execute(msg, args, embed, bot, serverQueue) {

		const time = validateTimestamp(args[1], serverQueue.node.totalDuration)

		if (time === false) {
			embed.setDescription(
				"**" +
             args[1] +
             "** is not a valid timestamp format, correct format should be **hh:mm:ss**.",
			)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (time === -1) {
			embed.setDescription(
				"**" +
          args[1] +
          "** is not a valid timestamp in this track, check this song's total duration.",
			)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		const dur = `${serverQueue.currentTrack.duration.padStart(5, "0")}`
		await serverQueue.node.seek(time)

		const timestamp = millisecondsToTimestamp(time)
		embed.setDescription("Track playback time set to **" + timestamp + "/" + dur + "**",)

		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
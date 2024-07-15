const { Events, ActivityType } = require("discord.js")

module.exports = {
	name: Events.ClientReady,
	execute(bot) {
		bot.user.setActivity({
			name: ".help | /help",
			type: ActivityType.Listening,
		})
		console.log("Bot is Up")
	},
}

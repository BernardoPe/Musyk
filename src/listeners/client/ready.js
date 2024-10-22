const { Events, ActivityType } = require("discord.js")

module.exports = {
	name: Events.ClientReady,
	async execute(bot) {
		bot.user.setActivity({
			name: ".help | /help",
			type: ActivityType.Listening,
		})
		const members = new Set()
		let serverCount = bot.guilds.cache.size
		bot.guilds.cache.forEach((guild) => {
			guild.members.fetch().then((fetchedMembers) => {
				fetchedMembers.forEach((member) => {
					if (!(member.user.bot || members.has(member.id))) {
						members.add(member.id)
					} 
				})
				serverCount--
			})
		})
		while (serverCount > 0) {
			await new Promise((resolve) => setTimeout(resolve, 100))
		}
		console.log(`Bot is ready, serving ${bot.guilds.cache.size} guild(s) with ${members.size} unique member(s)`)
	},
}

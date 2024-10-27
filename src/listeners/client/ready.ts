import {ClientEventHandler, MusicBot} from "../../types.ts"
import {Events, ActivityType} from "discord.js"
import {logger} from "../../utils/logger.ts"

class ClientReadyHandler implements ClientEventHandler {
	public name = Events.ClientReady

	public async execute(bot: MusicBot) {
		bot.user!.setActivity({
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
		logger.info(`Bot is ready, serving ${bot.guilds.cache.size} servers with ${members.size} members`)
	}
}

export default new ClientReadyHandler()
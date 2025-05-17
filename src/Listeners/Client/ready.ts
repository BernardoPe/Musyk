import { ClientEventHandler } from "../../types.ts"
import { Events, ActivityType, Client } from "discord.js"
import { logger } from "../../Utils/Logging/logger.ts"

class ClientReadyHandler implements ClientEventHandler {
	public name = Events.ClientReady

	public async execute(bot: Client) {
        bot.user!.setActivity({
        	name: ".help | /help",
        	type: ActivityType.Listening,
        })

        const members = new Set<string>()

        for (const guild of Array.from(bot.guilds.cache.values())) {
        	const fetchedMembers = await guild.members.fetch()
        	for (const member of Array.from(fetchedMembers.values())) {
        		if (!member.user.bot) {
        			members.add(member.id)
        		}
        	}
        }
        logger.info(`Bot is ready, serving ${bot.guilds.cache.size} servers with ${members.size} members`)
	}
}

export default new ClientReadyHandler()

import { Command, MusicBot } from "../types.ts"
import { sendEmbed, successEmbed } from "../utils/embeds.ts"
import { GuildTextBasedChannel } from "discord.js"

class PlayerCountCommand implements Command {
	public aliases = ["playercount"]
	public name = "playercount"
	public requiresPlayer = false
	public adminCommand = true
	public user = null
	public guild = null
	public msg = null

	public async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
	) {
		const embed = successEmbed(
			null,
			`Music is playing in ${bot.player.generateStatistics().queuesCount} server(s).`,
		)
		await sendEmbed(channel, { embeds: [embed] }, 20000)
		return
	}
}

export default new PlayerCountCommand()

import { sendEmbed, errorEmbed, successEmbed } from "../utils/embeds.ts"
import { MusicBot, PlayerCommand } from "../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"

class PauseCommand implements PlayerCommand {
	public aliases = ["pause"]
	public name = "pause"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue,
	) {
		if (serverQueue.dispatcher!.paused) {
			const embed = errorEmbed(null, "The player is already paused")
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const embed = successEmbed(null, "Paused the player")
    serverQueue.dispatcher!.pause()
    await sendEmbed(channel, { embeds: [embed] }, 20000)
    return
	}
}

export default new PauseCommand()

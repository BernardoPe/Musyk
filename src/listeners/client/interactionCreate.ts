import { Events } from "discord.js"
import { dispatchSlash } from "@/handlers/commands.ts"
import { handleButton } from "@/handlers/buttons.ts"

import type { BaseInteraction } from "discord.js"
import type { ClientEventHandler, MusicBot } from "@/types.ts"

class InteractionCreateHandler implements ClientEventHandler {
	public name: Events.InteractionCreate = Events.InteractionCreate

	public async execute(interaction: BaseInteraction, bot: MusicBot) {
		if (!interaction.guild) return
		if (interaction.isChatInputCommand()) {
			await dispatchSlash(bot, interaction)
			return
		}
		if (interaction.isButton()) {
			await handleButton(bot, interaction)
		}
	}
}

export default new InteractionCreateHandler()

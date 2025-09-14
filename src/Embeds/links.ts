import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import "dotenv/config"
import { Language } from "../langs"

const inviteLink: string = process.env.INVITE_LINK!

function createLink(lang: Language): ActionRowBuilder<ButtonBuilder> {
	const link = new ButtonBuilder()
		.setLabel(lang.embeds.create_link.label)
		.setURL(inviteLink)
		.setStyle(ButtonStyle.Link)
	return new ActionRowBuilder<ButtonBuilder>().addComponents(link)
}

export { createLink }

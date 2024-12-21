import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import "dotenv/config"

const inviteLink: string = process.env.INVITE_LINK!

function createLink(): ActionRowBuilder<ButtonBuilder> {
	const link = new ButtonBuilder().setLabel("Invite Link").setURL(inviteLink).setStyle(ButtonStyle.Link)
	return new ActionRowBuilder<ButtonBuilder>().addComponents(link)
}

export { createLink }

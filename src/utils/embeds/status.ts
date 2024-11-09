import { Colors, EmbedBuilder } from "discord.js"

function successEmbed(
	title: string | null,
	description: string | null
): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(Colors.Green)
}

function errorEmbed(
	title: string | null,
	description: string | null
): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(Colors.Red)
}

export { successEmbed, errorEmbed }

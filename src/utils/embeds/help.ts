import { Colors, EmbedBuilder } from "discord.js"
import { Language } from "../../langs"

function helpEmbeds(lang: Language): EmbedBuilder[] {
	const embed1 = new EmbedBuilder()
		.setAuthor({
			name: "Syken",
			url: "https://discord.com/users/259810801219534849",
			iconURL: "https://cdn.discordapp.com/avatars/259810801219534849/9a98973995330392dd7ed83feac84106.webp",
		})
		.setTitle(lang.embeds.help.intro.title)
		.setDescription(lang.embeds.help.intro.description)
		.setColor(Colors.Blue)

	const embed2 = new EmbedBuilder()
		.setTitle(lang.embeds.help.playing_music.title)
		.setDescription(lang.embeds.help.playing_music.description)
		.setColor(Colors.Blue)

	const embed3 = new EmbedBuilder()
		.setTitle(lang.embeds.help.commands.title)
		.setDescription(lang.embeds.help.commands.description)
		.setColor(Colors.Blue)

	const embed4 = new EmbedBuilder()
		.setTitle(lang.embeds.help.buttons.title)
		.addFields(
			{ name: "⏭️", value: lang.embeds.help.buttons.fields.skip },
			{ name: "⏯️", value: lang.embeds.help.buttons.fields.pause },
			{ name: "⏹️", value: lang.embeds.help.buttons.fields.stop },
			{ name: "🔊", value: lang.embeds.help.buttons.fields.increase_volume },
			{ name: "🔉", value: lang.embeds.help.buttons.fields.decrease_volume },
			{ name: "🔀", value: lang.embeds.help.buttons.fields.shuffle },
			{ name: "🔃", value: lang.embeds.help.buttons.fields.reverse },
			{ name: "🕒", value: lang.embeds.help.buttons.fields.queue },
			{ name: "🔄", value: lang.embeds.help.buttons.fields.loop },
			{ name: "🤖", value: lang.embeds.help.buttons.fields.autoplay },
			{ name: "🗑️", value: lang.embeds.help.buttons.fields.clear },
			{ name: "🔌", value: lang.embeds.help.buttons.fields.dc }
		)
		.setColor(Colors.Blue)

	const embed5 = new EmbedBuilder()
		.setTitle(lang.embeds.help.filters.title)
		.setDescription(lang.embeds.help.filters.description)
		.setColor(0x58b9ff)

	const embed6 = new EmbedBuilder()
		.setTitle(lang.embeds.help.additional_info.title)
		.setDescription(lang.embeds.help.additional_info.description)
		.setColor(Colors.Blue)

	return [embed1, embed2, embed3, embed4, embed5, embed6]
}

export { helpEmbeds }

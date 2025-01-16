import { Colors, EmbedBuilder } from "discord.js"
import langs from "../../langs"

function helpEmbeds(): EmbedBuilder[] {
	const embed1 = new EmbedBuilder()
		.setAuthor({
			name: "Syken",
			url: "https://discord.com/users/259810801219534849",
			iconURL: "https://cdn.discordapp.com/avatars/259810801219534849/9a98973995330392dd7ed83feac84106.webp",
		})
		.setTitle(langs.en.embeds.help.intro.title)
		.setDescription(langs.en.embeds.help.intro.description)
		.setColor(Colors.Blue)

	const embed2 = new EmbedBuilder()
		.setTitle(langs.en.embeds.help.playing_music.title)
		.setDescription(langs.en.embeds.help.playing_music.description)
		.setColor(Colors.Blue)

	const embed3 = new EmbedBuilder()
		.setTitle(langs.en.embeds.help.commands.title)
		.setDescription(langs.en.embeds.help.commands.description)
		.setColor(Colors.Blue)

	const embed4 = new EmbedBuilder()
		.setTitle(langs.en.embeds.help.buttons.title)
		.addFields(
			{ name: "⏭️", value: langs.en.embeds.help.buttons.fields.skip },
			{ name: "⏯️", value: langs.en.embeds.help.buttons.fields.pause },
			{ name: "⏹️", value: langs.en.embeds.help.buttons.fields.stop },
			{ name: "🔊", value: langs.en.embeds.help.buttons.fields.increase_volume },
			{ name: "🔉", value: langs.en.embeds.help.buttons.fields.decrease_volume },
			{ name: "🔀", value: langs.en.embeds.help.buttons.fields.shuffle },
			{ name: "🔃", value: langs.en.embeds.help.buttons.fields.reverse },
			{ name: "🕒", value: langs.en.embeds.help.buttons.fields.queue },
			{ name: "🔄", value: langs.en.embeds.help.buttons.fields.loop },
			{ name: "🤖", value: langs.en.embeds.help.buttons.fields.autoplay },
			{ name: "🗑️", value: langs.en.embeds.help.buttons.fields.clear },
			{ name: "🔌", value: langs.en.embeds.help.buttons.fields.dc }
		)
		.setColor(Colors.Blue)

	const embed5 = new EmbedBuilder()
		.setTitle(langs.en.embeds.help.filters.title)
		.setDescription(langs.en.embeds.help.filters.description)
		.setColor(0x58b9ff)

	const embed6 = new EmbedBuilder()
		.setTitle(langs.en.embeds.help.additional_info.title)
		.setDescription(langs.en.embeds.help.additional_info.description)
		.setColor(Colors.Blue)

	return [embed1, embed2, embed3, embed4, embed5, embed6]
}

export { helpEmbeds }

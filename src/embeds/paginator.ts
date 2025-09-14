import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildTextBasedChannel } from "discord.js"

async function paginate(channel: GuildTextBasedChannel, pages: EmbedBuilder[], buttons: ButtonBuilder[] = []) {
	if (!channel || !pages || pages.length <= 0) return

	let index = 0

	const button1 = new ButtonBuilder().setCustomId("1").setEmoji("◀️").setStyle(ButtonStyle.Primary).setDisabled(true)

	const button2 = new ButtonBuilder()
		.setCustomId("2")
		.setEmoji("▶️")
		.setStyle(ButtonStyle.Primary)
		.setDisabled(pages.length <= index + 1)

	const button3 = new ButtonBuilder().setCustomId("3").setEmoji("❌").setStyle(ButtonStyle.Secondary)

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button1, button2, button3)

	for (const element of buttons) {
		row.addComponents(element)
	}

	const data = await channel.send({
		embeds: [pages[index]],
		components: [row],
	})

	const col = data.createMessageComponentCollector({
		time: 60000,
	})

	col.on("collect", (i) => {
		if (i.customId === "1") index--
		else if (i.customId === "2") index++
		else return col.stop()

		button1.setDisabled(index === 0)
		button2.setDisabled(index === pages.length - 1)

		data.edit({
			components: [row],
			embeds: [pages[index]],
		})
	})

	col.on("end", () => {
		data.delete()
		col.stop()
	})
}

export default paginate

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async (msg, pages, buttons = []) => {
	if (!msg || !pages || !pages.length > 0) throw new Error("Wrong parameters")

	let index = 0

	const button1 = new ButtonBuilder()
		.setCustomId("1")
		.setEmoji("◀️")
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true)

	const button2 = new ButtonBuilder()
		.setCustomId("2")
		.setEmoji("▶️")
		.setStyle(ButtonStyle.Primary)
		.setDisabled(pages.length <= index + 1)

	const button3 = new ButtonBuilder()
		.setCustomId("3")
		.setEmoji("❌")
		.setStyle(ButtonStyle.Secondary)

	const row = new ActionRowBuilder().addComponents(button1, button2, button3)

	for (let i = 0; i < buttons.length; i++) {
		row.addComponents(buttons[i])
	}

	const data = await msg.channel.send({
		embeds: [pages[index]],
		components: [row],
		fetchReply: true,
	})

	const col = data.createMessageComponentCollector({
		time: 60000,
	})

	col.on("collect", (i) => {
		if (i.customId === "1") index--
		else if (i.customId === "2") index++
		else return col.stop()

		const button1 = new ButtonBuilder()
			.setCustomId("1")
			.setEmoji("◀️")
			.setStyle(ButtonStyle.Primary)
			.setDisabled(index === 0)

		const button2 = new ButtonBuilder()
			.setCustomId("2")
			.setEmoji("▶️")
			.setStyle(ButtonStyle.Primary)
			.setDisabled(pages.length <= index + 1)

		const button3 = new ButtonBuilder()
			.setCustomId("3")
			.setEmoji("❌")
			.setStyle(ButtonStyle.Secondary)

		row.components = [button1, button2, button3].concat(buttons)

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

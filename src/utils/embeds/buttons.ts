import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

function createButtons(): ActionRowBuilder<ButtonBuilder>[] {
	const commands: { [key: string]: string } = {
		skip: "⏭️",
		pause: "⏯️",
		stop: "⏹️",
		increaseVolume: "🔊",
		decreaseVolume: "🔉",
		shuffle: "🔀",
		reverse: "🔃",
		queue: "🕒",
		cycle: "🔄",
		autoplay: "🤖",
		clear: "🗑️",
		disconnect: "🔌",
	}

	const commandNames = Object.keys(commands)

	const rows: Array<ActionRowBuilder<ButtonBuilder>> = new Array(
		Math.ceil(commandNames.length / 5)
	)

	for (let i = 0; i < rows.length; i++) {
		rows[i] = new ActionRowBuilder()
	}

	for (let i = 0; i < commandNames.length; i++) {
		const button = new ButtonBuilder()
			.setCustomId(commandNames[i])
			.setEmoji(commands[commandNames[i]])
			.setStyle(ButtonStyle.Secondary)

		rows[Math.floor(i / 5)].addComponents(button)
	}

	return rows
}

export { createButtons }

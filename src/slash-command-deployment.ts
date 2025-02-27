import { REST, Routes, SlashCommandBuilder } from "discord.js"
import "dotenv/config"

const langsCommand = new SlashCommandBuilder()
	.setName("language")
	.setDescription("Set the bot language")
	.addStringOption((option) =>
		option
			.setName("language")
			.setDescription("The language you want to set")
			.setRequired(true)
			.addChoices(
				{ name: "English", value: "en" },
				{ name: "Português (Portugal)", value: "pt-pt" },
				{ name: "Current", value: "current" }
			)
	)
	.toJSON()

const prefixCommand = new SlashCommandBuilder()
	.setName("prefix")
	.setDescription("Set the bot prefix")
	.addStringOption((option) =>
		option.setName("prefix").setDescription("The prefix you want to set").setRequired(true)
	)
	.toJSON()

const helpCommand = new SlashCommandBuilder().setName("help").setDescription("Learn how to use Musyk").toJSON()

const rest = new REST().setToken(process.env.TOKEN || "");

(async () => {
	try {
		console.log("Started refreshing application (/) commands.")
		const data = await rest.put(Routes.applicationCommands(process.env.BOT_ID || ""), {
			body: [langsCommand, prefixCommand, helpCommand],
		})
		console.log("Successfully reloaded application (/) commands.", data)
	} catch (error) {
		console.error(error)
	}
})()

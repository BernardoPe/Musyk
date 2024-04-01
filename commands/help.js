const { helpEmbeds, createLink } = require("../utils/embeds")
const paginate = require("../utils/paginator.js")

module.exports = {
	aliases: ["help"],
	name: "help",
	execute: async (msg) => {
		let embed = helpEmbeds()

		let link = createLink()

		await paginate(msg, embed, link.components)
	},
}

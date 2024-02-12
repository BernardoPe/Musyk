const { Events } = require('discord.js');

module.exports = {
	name: Events.Error,
	execute(err) {
		console.log(err)
	},
};
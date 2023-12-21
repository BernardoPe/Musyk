const { Events, EmbedBuilder } = require('discord.js');
const commandHandler  = require('../../commandHandler.js')
const { getServerPrefixFromJson } = require('../../utils.js')

module.exports = {
	name: Events.MessageCreate,
	execute: async (msg, bot) => {
    
        if (msg.author.bot) return;

        let serverPrefix = getServerPrefixFromJson(msg.guild.id)
        if (!msg.content.startsWith(serverPrefix)) return;
        
        const embed = new EmbedBuilder()
           
        if (msg.content.startsWith(serverPrefix)) {
          const args = msg.content.split(' ');
          await commandHandler(msg, args, embed, bot);
        }

	},
};
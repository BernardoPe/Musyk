const { Util } = require("discord-player")
const { sendEmbed } = require('../utils.js')

module.exports = {
    aliases: ['pause'],
    name: 'pause',
    execute: async (msg, args, embed, bot) => {

        let serverQueue = bot.player.nodes.get(msg.guild.id)

        embed.setColor(0xfd0033).setDescription(`There is no song playing`);

        if (!serverQueue) return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
            else {
            while(serverQueue.isBuffering()) {
                Util.wait(5)
            } 
        }

        embed.setColor(0x01ff34).setDescription(`Paused current song`)

        serverQueue.dispatcher.pause();
     
        return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

    }
  };

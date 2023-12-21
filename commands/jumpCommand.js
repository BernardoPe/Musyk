const { Util } = require("discord-player")
const { sendEmbed } = require('../utils.js')

module.exports = {
    name: 'jump',
    execute: async (msg, args, embed, bot) => {

        const serverQueue = bot.player.nodes.get(msg.guild.id);

        embed.setColor(0xfd0033).setDescription(`Not currently playing any songs`);

        if (!serverQueue) return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
        else {
          while(serverQueue.dispatcher.isBuffering()) {
              Util.wait(5)
          } 
        }

        if (args[1] < 1 || args[1] > serverQueue.tracks.toArray().length) {
            embed.setDescription(`Invalid queue position`);
            return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
        }
        else {
            let index = parseInt(args[1])
            if(isNaN(index)) {
               embed.setDescription(`Value must be a number`);
               return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
            }

            serverQueue.node.jump(index - 1);

        }
    }
  };

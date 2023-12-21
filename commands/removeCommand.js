const { Util } = require("discord-player")
const { updatePlayer } = require('../utils.js')
const { sendEmbed } = require('../utils.js')

module.exports = {
    name: 'remove',
    execute: async (msg, args, embed, bot) => {
        embed.setColor(0xfd0033).setDescription(`There is no song playing`);
           
        serverQueue = bot.player.nodes.get(msg.guild.id)

        if(serverQueue && serverQueue.isPlaying()) {

            let value = parseInt(args[1])
            if(isNaN(value)) {
                embed.setDescription(`Value must be a number`);
                return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
            }

            let tracks = serverQueue.tracks.toArray()

            if( value < 1 || value > tracks.length) {
              embed.setDescription(`Invalid number, must be 1-${tracks.length}`)
              return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
            }
        
            else {
              let song = serverQueue.node.remove(tracks[value - 1]);
              embed.setColor(0x01ff34).setDescription(`Removed [${song.title}](${song.url}) from queue`)
              updatePlayer(serverQueue)
              return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
            }
        
      }

      return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

    }

  };

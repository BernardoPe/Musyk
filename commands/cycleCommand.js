const { QueueRepeatMode, Util } = require("discord-player");
const { sendEmbed } = require("../utils");

module.exports = {
  aliases: ['cycle'],
  name: "cycle",
  async execute(msg, args, embed, bot) {

    embed.setColor(0xfd0033).setDescription(`Not currently playing any songs`);

    let serverQueue = bot.player.nodes.get(msg.guild.id)

    if (!serverQueue || !serverQueue.isPlaying()) return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

    let mode = undefined;
    switch (args[1]) {
      case "off":
        serverQueue.setRepeatMode(QueueRepeatMode.OFF);
        mode = "Turned off loop mode.";
        break;
      case "track":
        serverQueue.setRepeatMode(QueueRepeatMode.TRACK);
        mode = "Repeating track activated";
        break;
      case "queue":
        serverQueue.setRepeatMode(QueueRepeatMode.QUEUE);
        mode = "Looping queue enabled.";
        break;
      case "autoplay":
        serverQueue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        mode = "Autoplay mode activated.";
        break;
      default:
        let md = "none";
        if (serverQueue.repeatMode === 3) {
          md = "autoplay";
        } else if (serverQueue.repeatMode == 2) {
          md = "queue";
        } else if (serverQueue.repeatMode == 1) {
          md = "track";
        } else if (serverQueue.repeatMode == 0) {
          md = "off";
        }

        embed.setDescription(`Loop mode is set to: \`${md}\`.`)

    }
    if (mode) embed.setDescription(mode);
    await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

  }
};

const { sendEmbed } = require('../utils.js')

module.exports = {
  aliases: ['p', 'play'],
  name: 'play',
  execute: async (msg, args, embed, bot) => {
    if (args.length == 1) {
      embed.setColor(0x06bb06).setDescription(`No search arguments provided`)
      return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
    }

    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) {
      embed.setColor(0x06bb06).setDescription(`Join a voice channel, ${msg.member}`)
      return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
    }

    const permissions = voiceChannel.permissionsFor(msg.client.user);

    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      embed.setDescription(`I cannot connect or speak in the voice channel. Please make sure to give me the necessary permissions.`)
      return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
    }

    const guildQueue = bot.player.nodes.get(msg.guild.id);

    let queue = (guildQueue) ? guildQueue : await bot.player.nodes.create(msg.guild, {
      bufferingTimeout: 20000,
      leaveOnEmpty: false,
      leaveOnEnd: true,
      leaveOnEndCooldown: 300000
    }); 
  
    try {
  
      if (!queue.connection) await queue.connect(voiceChannel);

      else if (queue.connection.joinConfig.channelId != voiceChannel) {
        embed.setDescription("Already playing in a different voice channel")
        return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
      }

    } catch (error) {
      bot.player.nodes.delete(msg.guild.id)
      return console.log(error)
    }

    args.shift();

    const str = args.join(' ').trim();
    let result = await bot.player.search(str, { requestedBy: msg.author }).catch(() => { });

    var song = result.tracks[0];

    try {

      if (result.tracks.length == 0) throw new Error("No results found")

      if (!queue.isPlaying() && !queue.willStart) {

        queue.setMetadata([queue.channel, msg.channel]);

        queue.willStart = true

        await queue.play(song)

        queue.willStart = false

        if (!queue.isPlaying() && !queue.dispatcher.isBuffering()) throw new Error('Play error')

      }

      else if (!result.playlist) {
        queue.addTrack(song);
      }
      
      else {
        queue.addTrack(result.playlist);
      }

    } catch (e) {
      console.log(e);
      embed.setDescription("No search results were found");
      return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
    }
  }
};

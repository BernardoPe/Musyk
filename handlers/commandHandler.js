const { getAllFiles } = require('../utils.js');
const path = require('node:path');
const { getServerPrefixFromJson } = require('../utils.js');

const commands = {};
const commandFiles = getAllFiles(path.join(__dirname, '../commands'));

commandFiles.forEach(file => {
    const command = require(file);
    command.aliases.forEach(alias => commands[alias] = command)
});

module.exports = async (msg, args, embed, bot) => {

    const PREFIX = getServerPrefixFromJson(msg.guild.id);

    if (!msg.content.startsWith(PREFIX)) return;

    const commandName = args[0].slice(PREFIX.length).toLowerCase();

    if (commands.hasOwnProperty(commandName)) {

        const command = commands[commandName];

        let date = new Date();
        command.msg = msg.content;
        command.time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        console.log(command);

        await command.execute(msg, args, embed, bot);

    } else {
        return undefined;
    }

};

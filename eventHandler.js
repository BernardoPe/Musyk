const fs = require('node:fs');
const path = require('node:path');

function addEventListeners(bot, folderPath = path.join(__dirname, 'listeners')) {
    
    const files = getAllFiles(folderPath);

    for (const file of files) {
        const event = require(file);
        const listener = (file.includes('player')) ? bot.player.events : bot;

        if (event.once) {
            listener.once(event.name, (...args) => event.execute(...args, bot));
        } else {
            listener.on(event.name, (...args) => event.execute(...args, bot));
        }
    }

}

function getAllFiles(folderPath) {

    let files = [];

    const items = fs.readdirSync(folderPath);

    for (const item of items) {
        const filePath = path.join(folderPath, item);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            files = files.concat(getAllFiles(filePath));
        } else {
            files.push(filePath);
        }
    }

    return files;

}

module.exports = { addEventListeners };

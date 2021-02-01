const writeLog = require('../lib/writeLog');
const initTotalC = require('../lib/initTotalC');
const updateTotalC = require('../lib/updateTotalC');
const TextProcess = require('../lib/text-processing');
const speak = require('../lib/speak');
module.exports = {
    name: 'bark',
    description: 'Text to speech',
    aliases: ['b'],
    cooldown: 5,
    args: true,
    usage: '<text>',
    execute(message, args) {
        let totalC = initTotalC();
        let string = args.join(" ");
        let voiceChannel = message.member.voice.channel;
        totalC = totalC + string.length;

        writeLog(`Arguments: ${string}`);
        writeLog(`Characters: ${string.length}`);
        writeLog(`TotalC: ${totalC}`);
        writeLog(`Voice Channel: ${voiceChannel}`);

        updateTotalC(totalC);
        string = TextProcess.normalizeAll(string);
        speak(string, voiceChannel);
    }
}
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
const ttsclient = new textToSpeech.TextToSpeechClient();
const writeLog = require('../lib/writeLog');

module.exports = async function (text, voiceChannel) {

    let ttsPath = "./TTSQueue/";
    let filename = `${ttsPath}${voiceChannel.id}.mp3`;

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'vi-VN-Wavenet-A', ssmlGender: 'FEMALE' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };
    // Performs the text-to-speech request
    const [response] = await ttsclient.synthesizeSpeech(request);
    
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filename, response.audioContent, 'binary');
    //writeLog('Audio content written to file: voice.mp3');


    voiceChannel.join().then(connection => {
        const dispatcher = connection.play(filename);
        dispatcher.on("end", end => {
            voiceChannel.leave();
        });
    }).catch(err => writeLog(err));
}
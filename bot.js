const Discord = require('discord.js');
const client = new Discord.Client();
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const ttsclient = new textToSpeech.TextToSpeechClient();
const propertiesReader = require('properties-reader');
const axios = require('axios');

const exampleEmbed = (
    temp,
    maxTemp,
    minTemp,
    pressure,
    humidity,
    wind,
    cloudness,
    icon,
    author,
    profile,
    cityName,
    country
) => new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(`Hello, ${author}`, profile)
    .setTitle(`There is ${temp}\u00B0 C in ${cityName}, ${country}`)
    .addField(`Max Temp:`, `${maxTemp}\u00B0 C`, true)
    .addField(`Min Temp:`, `${minTemp}\u00B0 C`, true)
    .addField(`Humidity:`, `${humidity} %`, true)
    .addField(`Wind Speed:`, `${wind} m/s`, true)
    .addField(`Pressure:`, `${pressure} hpa`, true)
    .addField(`Cloudiness:`, `${cloudness}`, true)
    .setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)
    .setFooter('Made With 💖 by @Sircle');

var config = propertiesReader('config.properties');
var meme_sound = propertiesReader('meme_sound.properties');
var normalizePro = propertiesReader('normalize_string.properties');
var whitelistBark = propertiesReader('whitelist.properties');
var blacklistMess = propertiesReader('blacklist.properties');
var totalC = 0;
var currentVoiceChannel;

var weatherCalls = 0;
var weatherApiToken = config.get("OpenWeatherMapToken");
var discordBotToken = config.get("BotToken");

client.on('ready', () => {
    initTotalC();
    initTotalWeatherCalls();
    writeLog("Connected as " + client.user.tag);
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return;
    }

    if (receivedMessage.content.startsWith("bark")) {
        processCommand(receivedMessage);
    } else if (receivedMessage.content.startsWith("rbark")) {
        processCommand(receivedMessage);
    } else if (receivedMessage.content.startsWith("dog")) {
        processCommand(receivedMessage);
    } else {
        var sender = blacklistMess.get(receivedMessage.member.user + "");
        if (sender == null) {
            let date_ob = new Date();
            let auth = receivedMessage.author.tag;
            let string = date_ob + ": " + auth + ":" + receivedMessage.content;
            fs.appendFile('message.log', string + "\n", function (err) {
                if (err) throw err;
            });
            writeLog("Wrote message from " + auth);
        }
    }
});

client.login(discordBotToken);

function processCommand(receivedMessage) {
    let splitCommand = receivedMessage.content.split(" ");
    let primaryCommand = splitCommand[0];
    writeLog("User: " + receivedMessage.member.user.tag);
    writeLog("Command receiverd: " + primaryCommand);

    if (primaryCommand == "bark") {

        let arguments = receivedMessage.content.substring(5);
        var voiceChannel = receivedMessage.member.voice.channel;
        currentVoiceChannel = voiceChannel;
        totalC = totalC + arguments.length;

        writeLog("Arguments: " + arguments);
        writeLog("Characters: " + arguments.length);
        writeLog("Total: " + totalC);
        writeLog("Voice Channel: " + voiceChannel);

        updateTotalC();
        if (meme_sound.get(arguments) != null) {
            var path = meme_sound.get(arguments);
            playLocal(path, voiceChannel);
        } else {
            arguments = normalizeAll(arguments);
            speak(arguments, voiceChannel);
        }
    } else if (primaryCommand == "rbark") {
        let arguments = receivedMessage.content.substring(6);
        let userID = receivedMessage.member.user + "";
        let userTag = receivedMessage.member.user.tag + "";

        if (whitelistBark.get(userID) == userTag) {
            totalC = totalC + arguments.length;

            writeLog("Arguments: " + arguments);
            writeLog("Characters: " + arguments.length);
            writeLog("Total: " + totalC);
            writeLog("Voice Channel: " + currentVoiceChannel);

            updateTotalC();
            if (meme_sound.get(arguments) != null) {
                var path = meme_sound.get(arguments);
                playLocal(path, voiceChannel);
            } else {
                arguments = normalizeAll(arguments);
                speak(arguments, currentVoiceChannel);
            }
        } else {
            receivedMessage.reply('You are not super user');
        }
    } else if (primaryCommand == "dog") {
        let arguments = receivedMessage.content.substring(4);
        let argument = arguments.split(" ");
        let command = argument[0];

        writeLog("Arguments: " + arguments);

        if (command == "reload") {
            if (receivedMessage.member.user == "252118396324413454") {
                reloadProperties();
                writeLog("Properties Reloaded!");
                receivedMessage.reply('Reloaded.');
            } else {
                receivedMessage.channel.send(receivedMessage.author.toString() + "Permission require!");
                writeLog(receivedMessage.member.user.tag + " is trying to use owner command!");
            }
        } else if (command == "weather") {
            let city = arguments.substring(8);
            if (!city.length) {
                writeLog("City: Unknown");
                receivedMessage.channel.send("Please give the weather location!");
            } else {
                writeLog("City: " + city);

                axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiToken}`)
                    .then(response => {
                        let apiData = response;
                        let currentTemp = Math.ceil(apiData.data.main.temp);
                        let maxTemp = apiData.data.main.temp_max;
                        let minTemp = apiData.data.main.temp_min;
                        let humidity = apiData.data.main.humidity;
                        let wind = apiData.data.wind.speed;
                        let author = receivedMessage.author.username;
                        let profile = receivedMessage.author.displayAvatarURL;
                        let icon = apiData.data.weather[0].icon;
                        let cityName = city;
                        let country = apiData.data.sys.country;
                        let pressure = apiData.data.main.pressure;
                        let cloudness = apiData.data.weather[0].description;
                        receivedMessage.channel.send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country));
                    }).catch(err => {
                        console.log(err);
                        writeLog(err);
                        receivedMessage.reply(`Enter a vailid city name`);
                    })
                weatherCalls = weatherCalls + 1;
                updateWeatherCalls();
            }


        }
        else if (command == "myid") {
            receivedMessage.reply('' + receivedMessage.member.user);
        } else {

        }


    }
}

//Reload properties
function reloadProperties() {
    meme_sound = propertiesReader('meme_sound.properties');
    normalizePro = propertiesReader('normalize_string.properties');
    whitelistBark = propertiesReader('whitelist.properties');
    blacklistMess = propertiesReader('blacklist.properties');
}

//Normalize text
function normalizeAll(arguments) {
    var string = arguments;
    normalizePro.each((key, value) => {
        string = normalize(string, key, value);
    });
    return string;
}

function normalize(arguments, string1, string2) {
    var string = arguments;
    if (string.startsWith(string1 + " ")) {
        string = string.substring(string1.length + 1);
        string = string2 + " " + string;
    }

    if (string.endsWith(" " + string1)) {
        string = string.substring(0, string.length - string1.length);
        string = string + string2;
    }

    if (string == string1) {
        string = string2;
    }
    string = string.replace(" " + string1 + " ", " " + string2 + " ");
    return string;
}

//Init and update total characters for statistic
function updateTotalC() {
    fs.writeFile('total.txt', totalC.toString(), function (err) {
        if (err) writeLog(err);
        writeLog("totalC > total.txt");
    });
}


function initTotalC() {
    fs.readFile('total.txt', 'utf8', function (err, data) {
        if (err) throw err;
        totalC += Number(data);
    });
}

function updateWeatherCalls() {
    fs.writeFile('Total_Weather_Calls.txt', weatherCalls.toString(), function (err) {
        if (err) writeLog(err);
        writeLog("weatherCalls > Total_Weather_Calls.txt");
    });
}

function initTotalWeatherCalls() {
    fs.readFile('Total_Weather_Calls.txt', 'utf8', function (err, data) {
        if (err) throw err;
        weatherCalls += Number(data);
    });
}

function playLocal(file, voiceChannel) {
    voiceChannel.join().then(connection => {
        const dispatcher = connection.play(file);
        dispatcher.on("end", end => {
            voiceChannel.leave();
        });
    }).catch(err => writeLog(err));
}

function writeLog(content) {
    let date_ob = new Date();
    var string = date_ob + ": " + content;
    console.log(string);
    fs.appendFile('doggo.log', string + "\n", function (err) {
        if (err) throw err;
    });
}


//Text to speech in voice channel
async function speak(text, voiceChannel) {

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
    await writeFile('voice.mp3', response.audioContent, 'binary');
    //writeLog('Audio content written to file: voice.mp3');


    voiceChannel.join().then(connection => {
        const dispatcher = connection.play('./voice.mp3');
        dispatcher.on("end", end => {
            voiceChannel.leave();
        });
    }).catch(err => writeLog(err));
}





const Discord = require('discord.js');
const fs = require('fs');
const util = require('util');
const axios = require('axios');

const { OpenAPIToken } = require('../config.json');
const initTotalWeatherCalls = require('../lib/initTotalWeatherCalls');
const updateWeatherCalls = require('../lib/updateWeatherCalls');
const writeLog = require('../lib/writeLog');

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
    .setFooter('Made by @Sircle');

module.exports = {
    name: 'weather',
    description: 'Check weather of specific city',
    aliases: ['w'],
    cooldown: 5,
    args: true,
    usage: '<city Name>',
    execute(message, args) {
        let weatherCalls = initTotalWeatherCalls();
        let city = args.join(" ");
        writeLog("City: " + city);
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OpenAPIToken}`)
            .then(response => {
                let apiData = response;
                let currentTemp = Math.ceil(apiData.data.main.temp);
                let maxTemp = apiData.data.main.temp_max;
                let minTemp = apiData.data.main.temp_min;
                let humidity = apiData.data.main.humidity;
                let wind = apiData.data.wind.speed;
                let author = message.author.username;
                let profile = message.author.displayAvatarURL;
                let icon = apiData.data.weather[0].icon;
                let cityName = city;
                let country = apiData.data.sys.country;
                let pressure = apiData.data.main.pressure;
                let cloudness = apiData.data.weather[0].description;
                message.channel.send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country));
            }).catch (err => {
                console.log(err);
                writeLog(err);
                message.reply("Can't find that city");
            });
        weatherCalls = weatherCalls + 1;
        updateWeatherCalls(weatherCalls);
    }
}
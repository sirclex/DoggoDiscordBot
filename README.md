# Doggo Discord Bot
A utility bot use Discord API. Update over time.

## Demo
![WeatherReply](https://raw.githubusercontent.com/sirclex/DoggoDiscordBot/main/ImageDemoGit/dogweatherLondon.PNG)

## Built Using
+ [Discord.js](https://discord.js.org) - Discord API wrapper
+ [GoogleCloud](https://cloud.google.com/text-to-speech) - Provides Text-to-Speech voice
+ [OpenWeatherMap](https://openweathermap.org) - Provides API for tracking weather

## Getting Started
These instructions will get you a copy of the bot up and running on your local machine for development and testing purposes.

### Prerequisites
+ [NodeJS](https://nodejs.org) >= 14.0.0
+ NPM >= 6.9.0
+ [Git](https://git-scm.com/)

### Installing
You will need to clone the repo to your machine
```
$ git clone https://github.com/sirclex/DoggoDiscordBot.git
$ cd DoggoDiscordBot
```

Install the dependencies

```
$ npm install
```

Edit file config.properties to add OpenWeatherMap API Token and Discord Bot Token.
```
{
	"prefix": "dog",
    	"BotToken": "",
    	"OpenAPIToken": ""
}
```

You also need to register to GoogleCloud to use their API and get a json file after finish.
Add path to json file to startup file

startbot.sh for Ubuntu/Linux
```
#!bin/bash
export GOOGLE_APPLICATION_CREDENTIALS=""
node bot.js
```

startbot_win.bat for Windows
```
set GOOGLE_APPLICATION_CREDENTIALS=
node bot.js
```

After it's installed and configurated, you can start the bot by doing the following
```
//On Ubuntu/Linux
sh startbot.sh

//On Windows
startbot_win.bat
```

## Features & Commands
+ Text to speech on current voice channel
```
dogbark <text>

//Example
dogbark Hello world
```

+ Check weather of a city
```
dogweather <City name>

//Example
dogweather London
```

## Author
+ [@sirclex](https://github.com/sirclex)

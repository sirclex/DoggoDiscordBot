const Discord = require('discord.js');
module.exports = {
    name: 'avatar',
    description: 'Inspect the tagged user, or your own avatar.',
    cooldown: 3,
    execute(message) {
        let user = message.mentions.users.first() || message.author;
        let embed = new Discord.MessageEmbed();
        embed.setTitle(user.tag);
        embed.setImage(user.avatarURL({size: 512}));
        return message.channel.send(embed);
    },
};
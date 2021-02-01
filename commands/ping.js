module.exports = {
    name: 'ping',
    description: 'Ping! Actually check the lantency',
    cooldown: 5,
    execute(message) {
        var ping = Math.round(message.client.ws.ping);
        message.channel.send(`I'm working at ${ping}ms delay`);
    }
}
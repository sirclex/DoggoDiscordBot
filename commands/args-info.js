module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	args: true,
	execute(message, args) {
		let string = args.join(" ");

		message.channel.send(`Argument: ${string}`);
	},
};
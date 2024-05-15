const { Events } = require('discord.js');
const { GuildManager } = require('../util/GuildManager.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {
		const guild = newMessage.guild;
		const guildManager = new GuildManager(guild);
		await guildManager.init();

		const channel = guildManager.getChannel();

		if (newMessage.channel.id == channel) {
			if (newMessage.cleanContent == '[Original Message Deleted]') {
				newMessage.delete().catch((err) => {
					if (err.rawError.message == 'Missing Permissions') {
						newMessage
							.reply('Failed to delete message. Bot needs manage messages permission')
							.catch(() => {});
					} else {
						console.log(err);
						newMessage
							.reply('Failed to delete message. Unknown reason, contact Liv.')
							.catch(() => {});
					}
				});
				const reply = guildManager.getReply(newMessage.id);
				newMessage.channel.messages
					.fetch(reply)
					.then((message) => {
						message
							.delete()
							.then(async () => {
								await guildManager.unsetReply(newMessage.id);
							})
							.catch(async () => {
								await guildManager.unsetReply(newMessage.id);
							});
					})
					.catch(() => {});
			}
		}
	}
};

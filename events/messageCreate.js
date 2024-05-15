const { Events } = require('discord.js');
const { GuildManager } = require('../util/GuildManager.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const guild = message.guild;
		const guildManager = new GuildManager(guild);
		await guildManager.init();

		const channel = guildManager.getChannel();

		if (message.channel.id == channel) {
			const content = message.cleanContent;
			let role = '';
			if (content.includes('@Foundation Scrim')) {
				role = guildManager.getRole('fl');
			} else if (content.includes('@Academy Scrim')) {
				role = guildManager.getRole('al');
			} else if (content.includes('@Champion Scrim')) {
				role = guildManager.getRole('cl');
			} else if (content.includes('@Master Scrim')) {
				role = guildManager.getRole('ml');
			} else if (content.includes('@Premier Scrim')) {
				role = guildManager.getRole('pl');
			}

			if (role !== '') {
				message
					.reply('<@&' + role + '>, new scrim ping!')
					.then(async (reply) => {
						await guildManager.setReply(message.id, reply.id);
					})
					.catch(() => {});
			}
		}
	}
};

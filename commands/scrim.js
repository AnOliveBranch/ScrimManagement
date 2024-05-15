const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { GuildManager } = require('../util/GuildManager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scrim')
		.setDescription('Scrim ping management command')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommandGroup((group) =>
			group
				.setName('channel')
				.setDescription('Manages the set scrim channel')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('set')
						.setDescription('Sets the scrim channel')
						.addChannelOption((option) =>
							option.setName('channel').setDescription('The channel to set').setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand.setName('unset').setDescription('Removes the set scrim channel')
				)
		)
		.addSubcommandGroup((group) =>
			group
				.setName('role')
				.setDescription('Manages the set scrim roles to ping')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('set')
						.setDescription('Sets the role for a league')
						.addStringOption((option) =>
							option
								.setName('league')
								.setDescription('The league to set the role for')
								.setRequired(true)
								.setChoices(
									{ name: 'FL', value: 'FL' },
									{ name: 'AL', value: 'AL' },
									{ name: 'CL', value: 'CL' },
									{ name: 'ML', value: 'ML' },
									{ name: 'PL', value: 'PL' }
								)
						)
						.addRoleOption((option) =>
							option.setName('role').setDescription('The role to set').setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('unset')
						.setDescription('Sets the role for a league')
						.addStringOption((option) =>
							option
								.setName('league')
								.setDescription('The league to remove the set role for')
								.setRequired(true)
								.setChoices(
									{ name: 'FL', value: 'FL' },
									{ name: 'AL', value: 'AL' },
									{ name: 'CL', value: 'CL' },
									{ name: 'ML', value: 'ML' },
									{ name: 'PL', value: 'PL' }
								)
						)
				)
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const guild = interaction.guild;
		const guildManager = new GuildManager(guild);
		await guildManager.init();

		const subcommandGroup = interaction.options.getSubcommandGroup();
		const subcommand = interaction.options.getSubcommand();

		if (subcommandGroup === 'channel') {
			if (subcommand === 'set') {
				const channelOption = interaction.options.getChannel('channel').id;

				await guildManager.setChannel(channelOption);
				interaction.editReply({
					content: `Set <#${channelOption}> as the scrim channel to listen to.`
				});
			} else if (subcommand === 'unset') {
				await guildManager.unsetChannel();
				interaction.editReply({
					content: `Removed the set scrim channel to listen to.`
				});
			}
		} else if (subcommandGroup === 'role') {
			const leagueOption = interaction.options.getString('league');
			if (subcommand === 'set') {
				const roleOption = interaction.options.getRole('role').id;

				await guildManager.setRole(leagueOption.toLowerCase(), roleOption);
				interaction.editReply({
					content: `Set <@&${roleOption}> as the role for ${leagueOption}.`
				});
			} else if (subcommand === 'unset') {
				await guildManager.unsetRole(leagueOption.toLowerCase());
				interaction.editReply({
					content: `Removed the set role for ${leagueOption}.`
				});
			}
		}
	}
};

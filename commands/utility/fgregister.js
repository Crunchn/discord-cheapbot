const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../events/sqlite.js')

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('fgregister')
		.setDescription('Registers Channel for Free Games Alerting!'),
	async execute(interaction) {

		try {
            
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				channel: interaction.channel.id,
			});
            console.log(interaction.channel.id + " Registered");
			return interaction.reply(`Channel id ${tag.channel} registered.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('Channel id already registered.');
			}

			return interaction.reply('Something went wrong with adding a tag.');
		}


	},
};
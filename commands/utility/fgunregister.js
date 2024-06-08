const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../events/sqlite.js')

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('fgunregister')
		.setDescription('Unregisters Channel for Free Games Alerting!'),
	async execute(interaction) {

		try {
            
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tagName = await Tags.destroy({ where: { channel: interaction.channel.id } });
            if (!tagName) {
                return interaction.reply('That tag doesn\'t exist.');
                console.log(interaction.channel.id + " Unregistered");
                return interaction.reply(`Channel id ${interaction.channel.id} unregistered.`);
            } else {
                console.log(interaction.channel.id + " Unregistered");
                return interaction.reply(`Channel id ${interaction.channel.id} unregistered.`);
            }
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('Channel id already unregistered.');
			}

			return interaction.reply('Something went wrong with removing a tag.');
		}


	},
};
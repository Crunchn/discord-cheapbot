const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, strikethrough } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const storedata = require('./stor/stores.json');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('freegames')
		.setDescription('Replies with free games!'),
	async execute(interaction, fCondition) {
        
        if (fCondition === undefined) {
            await interaction.deferReply();
        }
        const data = require('./stor/freegames.json');
        const canvas = Canvas.createCanvas(1284, 1274);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./commands/utility/stor/book.jpg');
        
        // This uses the canvas dimensions to stretch the image onto the entire canvas
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        for(igame in data){

            // If you don't care about the performance of HTTP requests, you can instead load the avatar using
            const avatar = await Canvas.loadImage(data[igame].thumb);
        
            // Draw a shape onto the main canvas
            context.drawImage(avatar, 500, 500, 350, 520);
        
            // Use the helpful Attachment class structure to process the file for you
            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'gam-img.png' });

            const embed = new EmbedBuilder()
            .setAuthor({
                name: 'deals@fine.moe',
                url: 'https://fine.moe',
                iconURL: 'https://www.cheapshark.com' + storedata[(data[igame].storeID - 1)].images.logo,
            })
            .setTitle(data[igame].title)
            .setURL('https://www.cheapshark.com/redirect?dealID=' + data[igame].dealID)
            .setDescription('------')
            .setImage('attachment://gam-img.png')
            .setThumbnail()
            .setFields(
                {
                    name: 'Steam Rating',
                    value: data[igame].steamRatingText,
                    inline: true
                },
                {
                    name: 'Store',
                    value: storedata[(data[igame].storeID - 1)].storeName,
                    inline: true
                },
                {
                    name: 'Price',
                    value: data[igame].salePrice + ' ' + strikethrough(data[igame].normalPrice),
                    inline: true
                }
            )
            .setFooter({
                text: 'Smell my feet.',
                iconURL: 'https://www.cheapshark.com' + storedata[(data[igame].storeID - 1)].images.logo,
            })
            .setTimestamp();
            
            if (fCondition === undefined){
                await interaction.followUp({ embeds: [embed], files: [attachment] });
            } else {
                await interaction.send({ embeds: [embed], files: [attachment] })
                .then(console.log(`Sent ${data[igame].title} to ${interaction.id}`))
                .catch(err => console.log(`Unable to post to ${interaction.id}`));
            };

        }

    }
    
};

const { EmbedBuilder } = require('discord.js');


const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Some title')
    .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org/' })
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png%27')
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: false })
    .setImage('https://i.imgur.com/AfFp7pu.png%27')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

channel.send({ embeds: [exampleEmbed] });
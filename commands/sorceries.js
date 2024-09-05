const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getSorceries() {
    try {
        const response = await axios.get('https://eldenring.fanapis.com/api/sorceries?limit=100');
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar as sorceries:', error);
        throw error;
    }
}

async function sorceries(client) {
    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!sorcerie ')) {
            const sorcerieName = message.content.slice(10).trim().toLowerCase();

            try {
                const sorceries = await getSorceries();

               
                const exactMatch = sorceries.find(sorcerie => sorcerie.name.toLowerCase() === sorcerieName);
                if (exactMatch) {
                    const embed = createSorcerieEmbed(exactMatch);
                    message.channel.send({ embeds: [embed] });
                    return; 
                }

               
                const matchedSorceries = sorceries.filter(sorcerie => {
                    const normalizedSorcerieName = sorcerie.name.toLowerCase();
                    return normalizedSorcerieName.startsWith(sorcerieName);
                });

                if (matchedSorceries.length > 0) {
                    if (matchedSorceries.length === 1) {
                        const embed = createSorcerieEmbed(matchedSorceries[0]);
                        message.channel.send({ embeds: [embed] });
                    } else {
                        const sorcerieList = matchedSorceries.map(sorcerie => `**- ${sorcerie.name}**\n`);
                        const embed = new EmbedBuilder()
                            .setTitle('Sorceries encontradas:')
                            .setDescription(sorcerieList.join('\n'))
                            .setColor('#0099ff')
                            .setFooter({ text: 'Created by Rannis Archives' });

                        message.channel.send({ embeds: [embed] });
                    }
                } else {
                    message.channel.send("Nenhuma sorcerie encontrada com esse nome.");
                }
            } catch (error) {
                console.error('Erro ao buscar as sorceries:', error);
                message.channel.send("Ocorreu um erro ao buscar as sorceries.");
            }
        }
    });
}

function createSorcerieEmbed(sorcerie) {
    const requires = sorcerie.requires.map(req => `**${req.name}:** ${req.amount}`).join('\n');
    
    return new EmbedBuilder()
        .setTitle(sorcerie.name)
        .setDescription(sorcerie.description)
        .setImage(sorcerie.image)
        .setThumbnail("https://i.redd.it/prl6fvjugdk81.png")
        .addFields(
            { name: 'Type: ', value: sorcerie.type, inline: true },
            { name: 'Cost: ', value: String(sorcerie.cost), inline: true }, 
            { name: 'Slots: ', value: String(sorcerie.slots), inline: true }, 
            { name: 'Effects: ', value: sorcerie.effects, inline: true },
            { name: 'Requires: ', value: requires, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Created by Rannis Archives' });
}

module.exports = { sorceries };

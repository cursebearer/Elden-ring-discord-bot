const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getIncantations() {
    try {
        const response = await axios.get('https://eldenring.fanapis.com/api/incantations?limit=100');
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar as incantações:', error);
        throw error;
    }
}

async function incantations(client) {
    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!incantation ')) {
            const incantationNameWithNumber = message.content.slice(13).trim().toLowerCase();
            const match = incantationNameWithNumber.match(/^(.*?)(\s+\d+)$/);
            const incantationName = match ? match[1] : incantationNameWithNumber;

            try {
                const incantations = await getIncantations();

                
                const exactMatch = incantations.find(incantation => incantation.name.toLowerCase() === incantationName);
                if (exactMatch) {
                    const embed = createIncantationEmbed(exactMatch);
                    message.channel.send({ embeds: [embed] });
                    return; 
                }

              
                const matchedIncantations = incantations.filter(incantation => {
                    const normalizedIncantationName = incantation.name.toLowerCase();
                    return normalizedIncantationName.startsWith(incantationName);
                });

                if (matchedIncantations.length > 0) {
                    if (matchedIncantations.length === 1) {
                        const embed = createIncantationEmbed(matchedIncantations[0]);
                        message.channel.send({ embeds: [embed] });
                    } else {
                        const incantationList = matchedIncantations.map(incantation => `**- ${incantation.name}**\n`);
                        const embed = new EmbedBuilder()
                            .setTitle('Incantações encontradas:')
                            .setDescription(incantationList.join('\n'))
                            .setColor('#0099ff')
                            .setFooter({ text: 'Created by Rannis Archives' });

                        message.channel.send({ embeds: [embed] });
                    }
                } else {
                    message.channel.send("Nenhuma incantação encontrada com esse nome.");
                }
            } catch (error) {
                console.error('Erro ao buscar as incantações:', error);
                message.channel.send("Ocorreu um erro ao buscar as incantações.");
            }
        }
    });
}

function createIncantationEmbed(incantation) {
    const requires = incantation.requires.map(requirement => `${requirement.name}: ${requirement.amount}`).join('\n');

    return new EmbedBuilder()
        .setTitle(incantation.name)
        .setDescription(incantation.description)
        .setImage(incantation.image)
        .setThumbnail("https://i.redd.it/prl6fvjugdk81.png")
        .addFields(
            { name: 'Tipo: ', value: incantation.type, inline: true },
            { name: 'Custo: ', value: String(incantation.cost), inline: true },
            { name: 'Slots: ', value: String(incantation.slots), inline: true },
            { name: 'Efeitos: ', value: incantation.effects, inline: true },
            { name: 'Requer: ', value: requires, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Created by Rannis Archives' });
}

module.exports = { incantations };

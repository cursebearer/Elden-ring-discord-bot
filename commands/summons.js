const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getSummons() {
    try {
        const response = await axios.get('https://eldenring.fanapis.com/api/spirits?limit=100');
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar summons:', error);
        throw error;
    }
}

async function summons(client) {
    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!summon ')) {
            const summonName = message.content.slice(8).trim().toLowerCase();

            try {
                const summons = await getSummons();

                const matchedSummons = summons.filter(summon => summon.name.toLowerCase().startsWith(summonName));

                if (matchedSummons.length > 0) {
                    if (matchedSummons.length === 1) {
                        const embed = createSummonEmbed(matchedSummons[0]);
                        message.channel.send({ embeds: [embed] });
                    } else {
                        const summonList = matchedSummons.map(summon => `**- ${summon.name}**\n`);
                        const embed = new EmbedBuilder()
                            .setTitle('Summons encontrados:')
                            .setDescription(summonList.join('\n'))
                            .setColor('#0099ff')
                            .setFooter({ text: 'Created by Rannis Archives' });

                        message.channel.send({ embeds: [embed] });
                    }
                } else {
                    message.channel.send("Nenhum summon encontrado com esse nome.");
                }
            } catch (error) {
                console.error('Erro ao buscar os summons:', error);
                message.channel.send("Ocorreu um erro ao buscar os summons.");
            }
        }
    });
}

function createSummonEmbed(summon) {
    return new EmbedBuilder()
        .setTitle(summon.name)
        .setDescription(summon.description)
        .setImage(summon.image)
        .setThumbnail("https://i.redd.it/prl6fvjugdk81.png")
        .addFields(
            { name: 'Efeito: ', value: summon.effect, inline: true },
            { name: 'Custo de FP: ', value: summon.fpCost, inline: true },
            { name: 'Custo de HP: ', value: summon.hpCost, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Criado por Rannis Archives' });
}

module.exports = { summons };

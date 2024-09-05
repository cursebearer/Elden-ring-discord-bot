const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getTalismans() {
    try {
        const response = await axios.get('https://eldenring.fanapis.com/api/talismans?limit=100');
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar talismãs:', error);
        throw error;
    }
}

async function talismans(client) {
    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!talisman ')) {
            const talismanName = message.content.slice(10).trim().toLowerCase();

            try {
                const talismans = await getTalismans();

                const matchedTalismans = talismans.filter(talisman => talisman.name.toLowerCase().startsWith(talismanName));

                if (matchedTalismans.length > 0) {
                    if (matchedTalismans.length === 1) {
                        const embed = createTalismanEmbed(matchedTalismans[0]);
                        message.channel.send({ embeds: [embed] });
                    } else {
                        const talismanList = matchedTalismans.map(talisman => `**- ${talisman.name}**\n`);
                        const embed = new EmbedBuilder()
                            .setTitle('Talismãs encontrados:')
                            .setDescription(talismanList.join('\n'))
                            .setColor('#0099ff')
                            .setFooter({ text: 'Created by Rannis Archives' });

                        message.channel.send({ embeds: [embed] });
                    }
                } else {
                    message.channel.send("Nenhum talismã encontrado com esse nome.");
                }
            } catch (error) {
                console.error('Erro ao buscar os talismãs:', error);
                message.channel.send("Ocorreu um erro ao buscar os talismãs.");
            }
        }
    });
}

function createTalismanEmbed(talisman) {
    return new EmbedBuilder()
        .setTitle(talisman.name)
        .setDescription(talisman.description)
        .setImage(talisman.image)
        .setThumbnail("https://i.redd.it/prl6fvjugdk81.png")
        .addFields(
            { name: 'Efeitos: ', value: talisman.effect, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Criado por Rannis Archives' });
}

module.exports = { talismans };

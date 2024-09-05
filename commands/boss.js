const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getBosses() {
    const baseURL = 'https://eldenring.fanapis.com/api/bosses';
    const limit = 100;
    const pages = [0, 1]; 

    let bosses = [];

    for (const page of pages) {
        const url = `${baseURL}?limit=${limit}&page=${page}`;

        try {
            const response = await axios.get(url);
            bosses = bosses.concat(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar chefes:', error);
        }
    }

    return bosses;
}

async function boss(client) {
    const bosses = await getBosses();

    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!boss ')) {
            const bossName = message.content.slice(6).toLowerCase();

            const matchedBosses = bosses.filter(boss => boss.name.toLowerCase().includes(bossName));

            if (matchedBosses.length > 0) {
                if (matchedBosses.length === 1) {
                    const embed = createBossEmbed(matchedBosses[0]);
                    message.channel.send({ embeds: [embed] });
                } else {
                    const bossList = matchedBosses.map(boss => `**- ${boss.name}**\n`);
                    const embed = new EmbedBuilder()
                        .setTitle('Bosses encontrados:')
                        .setDescription(bossList.join('\n'))
                        .setColor('#0099ff')
                        .setFooter({ text: 'Created by Rannis Archives' });

                    message.channel.send({ embeds: [embed] });
                }
            } else {
                message.channel.send("Nenhum chefe encontrado.");
            }
        }
    });
}

function createBossEmbed(boss) {
    return new EmbedBuilder()
        .setTitle(boss.name)
        .setDescription(boss.description)
        .setImage(boss.image)
        .setThumbnail("https://i.redd.it/prl6fvjugdk81.png")
        .addFields(
            { name: 'Região: ', value: boss.region, inline: true },
            { name: 'Localização: ', value: boss.location, inline: false },
            { name: 'Drops: ', value: boss.drops.join(', '), inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Created by Rannis Archives' });
}

module.exports = { boss };

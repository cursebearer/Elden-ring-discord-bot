const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getItems() {
    const baseURL = 'https://eldenring.fanapis.com/api/items';
    const limit = 100;
    const pages = [0, 1, 2, 3, 4]; 

    let items = [];

    for (const page of pages) {
        const url = `${baseURL}?limit=${limit}&page=${page}`;

        try {
            const response = await axios.get(url);
            items = items.concat(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    }

    return items;
}

async function items(client) {
    const items = await getItems();

    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!item ')) {
            const itemName = message.content.slice(6).toLowerCase(); 

            const matchedItems = items.filter(item => item.name.toLowerCase().startsWith(itemName));

            if (matchedItems.length > 0) {
                if (matchedItems.length === 1) {
                    const embed = createItemEmbed(matchedItems[0]);
                    message.channel.send({ embeds: [embed] });
                } else {
                    const itemList = matchedItems.map(item => `**- ${item.name}**\n`);
                    const embed = new EmbedBuilder()
                        .setTitle('Itens encontrados:')
                        .setDescription(itemList.join('\n'))
                        .setColor('#0099ff')
                        .setFooter({ text: 'Created by Rannis Archives' });

                    message.channel.send({ embeds: [embed] });
                }
            } else {
                message.channel.send("Nenhum item encontrado.");
            }
        }
    });
}

function createItemEmbed(item) {
    return new EmbedBuilder()
        .setTitle(item.name)
        .setDescription(item.description)
        .setImage(item.image)
        .setThumbnail("https://i.redd.it/prl6fvjugdk81.png")
        .addFields(
            { name: 'Efeitos: ', value: item.effect, inline: true },
            { name: 'Tipo: ', value: item.type, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Created by Rannis Archives' });
}

module.exports = { items };

const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getLocations() {
    const baseURL = 'https://eldenring.fanapis.com/api/locations';
    const limit = 100;
    const pages = [0, 1]; 

    let locations = [];

    for (const page of pages) {
        const url = `${baseURL}?limit=${limit}&page=${page}`;

        try {
            const response = await axios.get(url);
            locations = locations.concat(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar locais:', error);
        }
    }

    // Removendo duplicatas
    locations = locations.filter((location, index) => locations.findIndex(l => l.name === location.name) === index);

    return locations;
}

function places(client) {
    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!place ')) {
            const searchTerm = message.content.slice(7).trim().toLowerCase(); 

            try {
                const locations = await getLocations();

                const matchedLocations = locations.filter(location => {
                    const locationNameNormalized = location.name.toLowerCase();
                    return locationNameNormalized.startsWith(searchTerm);
                });

                if (matchedLocations.length > 0) {
                    if (matchedLocations.length === 1) {
                        const embed = createLocationEmbed(matchedLocations[0]);
                        message.channel.send({ embeds: [embed] });
                    } else {
                        const locationList = matchedLocations.map(location => `**- ${location.name}**\n`);
                        const embed = new EmbedBuilder()
                            .setTitle('Locais encontrados:')
                            .setDescription(locationList.join('\n'))
                            .setColor('#0099ff')
                            .setFooter({ text: 'Created by Rannis Archives' });

                        message.channel.send({ embeds: [embed] });
                    }
                } else {
                    message.channel.send("Nenhum local encontrado.");
                }
            } catch (error) {
                console.error(error);
                message.channel.send("Ocorreu um erro ao buscar os locais.");
            }
        }
    });
}

function createLocationEmbed(location) {
    return new EmbedBuilder()
        .setTitle(location.name)
        .setDescription(location.description)
        .setImage(location.image)
        .setThumbnail("https://i.redd.it/prl6fvjugdk81.png")
        .setTimestamp()
        .setFooter({ text: 'Created by Rannis Archives' });
}

module.exports = { places };

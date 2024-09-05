const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getWeapons() {
    const baseURL = 'https://eldenring.fanapis.com/api/weapons';
    const limit = 100;
    const pages = [0, 1, 2, 3]; 

    let weapons = [];

    for (const page of pages) {
        const url = `${baseURL}?limit=${limit}&page=${page}`;

        try {
            const response = await axios.get(url);
            weapons = weapons.concat(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar armas:', error);
        }
    }

    return weapons;
}

async function weapons(client) {
    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!weapon ')) {
            const weaponName = message.content.slice(8).trim().toLowerCase();

            try {
                const weapons = await getWeapons();

                const matchedWeapons = weapons.filter(weapon => weapon.name.toLowerCase().startsWith(weaponName));

                if (matchedWeapons.length > 0) {
                    if (matchedWeapons.length === 1) {
                        const embed = createWeaponEmbed(matchedWeapons[0]);
                        message.channel.send({ embeds: [embed] });
                    } else {
                        const weaponList = matchedWeapons.map(weapon => `**- ${weapon.name}**\n`);
                        const embed = new EmbedBuilder()
                            .setTitle('Armas encontradas:')
                            .setDescription(weaponList.join('\n'))
                            .setColor('#0099ff')
                            .setFooter({ text: 'Created by Rannis Archives' });

                        message.channel.send({ embeds: [embed] });
                    }
                } else {
                    message.channel.send("Nenhuma arma encontrada.");
                }
            } catch (error) {
                console.error('Erro ao buscar armas:', error);
                message.channel.send("Ocorreu um erro ao buscar as armas.");
            }
        }
    });
}

function createWeaponEmbed(weapon) {
    const attackP = JSON.stringify(weapon.attack[0], ["amount"]);
var phy = JSON.parse(attackP);

const attackM = JSON.stringify(weapon.attack[1], ["amount"]);
var mag = JSON.parse(attackM);

const attackF = JSON.stringify(weapon.attack[2], ["amount"]);
var fire = JSON.parse(attackF);

const attackL = JSON.stringify(weapon.attack[3], ["amount"]);
var light = JSON.parse(attackL);

const attackH = JSON.stringify(weapon.attack[4], ["amount"]);
var holy = JSON.parse(attackH);

const attackC = JSON.stringify(weapon.attack[5], ["amount"]);
var crit = JSON.parse(attackC);

const requireFields = weapon.requiredAttributes.map(attr => ({ name: attr.name, amount: attr.amount }));
const scaleFields = weapon.scalesWith.map(scale => ({ name: scale.name, scaling: scale.scaling }));

const fields = [
    { name: 'Weight: ', value: weapon.weight.toString(), inline: false }, 
    { name: 'Attack: ', value: " ", inline: false },
    { name: 'Phy: ', value: phy ? phy.amount.toString() : 'N/A', inline: true }, 
    { name: 'Mag: ', value: mag ? mag.amount.toString() : 'N/A', inline: true }, 
    { name: 'Fire: ', value: fire ? fire.amount.toString() : 'N/A', inline: true }, 
    { name: 'Holy: ', value: holy ? holy.amount.toString() : 'N/A', inline: true }, 
    { name: 'Critical: ', value: crit ? crit.amount.toString() : 'N/A', inline: true }, 
];

requireFields.forEach(attr => {
    if (attr.name !== 'N/A' && attr.amount !== 'N/A') {
        fields.push({ name: `${attr.name}: `, value: attr.amount.toString(), inline: true }); 
    }
});

scaleFields.forEach(scale => {
    if (scale.name !== 'N/A' && scale.scaling !== 'N/A') {
        fields.push({ name: `${scale.name}: `, value: scale.scaling.toString(), inline: true }); 
    }
});


    return new EmbedBuilder()
        .setTitle(weapon.name)
        .setDescription(weapon.description)
        .setImage(weapon.image)
        .addFields(fields)
        .setThumbnail("https://i.redd.it/prl6fvjugdk81.png")
        .setTimestamp()
        .setFooter({ text: 'Created by Rannis Archives' });
}

module.exports = { weapons };
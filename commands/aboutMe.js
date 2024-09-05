const { EmbedBuilder } = require('discord.js');

function aboutMe(client) {
    client.on('messageCreate', (message) => {
        if (message.content === '!sobre') {
            const embed = new EmbedBuilder()
            .setTitle('Sobre Mim')
            .setDescription('Olá!\n\nEu sou um bot criado pelo desenvolvedor Shura(github.com/cursebearer). \n\n  Estou aqui para fornecer informações sobre armas, invocações e talismãs do jogo Elden Ring.\n\nSe precisar de alguma informação ou assistência, basta me chamar!')
            .setColor('#0099ff')
            .setThumbnail('https://avatars.githubusercontent.com/u/82187016?s=400&u=0c36cac2c4958e90ab079bde82c55b488e9a3105&v=4') // Substitua pela URL da sua imagem de avatar
            .setTimestamp()
            .setFooter({ text: 'Created by Rannis Archives' });

            message.channel.send({ embeds: [embed] });
        }
    });
}

module.exports = { aboutMe };

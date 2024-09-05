const { EmbedBuilder } = require('discord.js');

function help(client) {
    client.on('messageCreate', (message) => {
        if (message.content === '!help') {
            const embed = new EmbedBuilder()
                .setTitle('Lista de Comandos')
                .setDescription('Aqui está uma lista de comandos disponíveis e o que eles fazem:')
                .setColor('#0099ff')
                .addFields(
                    { name: '**!weapon [nome]**', value: 'Mostra informações sobre uma arma específica.' },
                    { name: '**!summon [nome]**', value: 'Mostra informações sobre uma invocação específica.' },
                    { name: '**!boss [nome]**', value: 'Mostra informações sobre um boss específico.' },
                    { name: '**!item [nome]**', value: 'Mostra informações sobre um item específico.' },
                    { name: '**!place [nome]**', value: 'Mostra informações sobre um lugar específico.' },
                    { name: '**!talisman [nome]**', value: 'Mostra informações sobre um talismã específico.' },
                    { name: '**!incantation [nome]**', value: 'Mostra informações sobre uma incantation específica.' },
                    { name: '**!sorcerie [nome]**', value: 'Mostra informações sobre uma sorcerie específica.' },
                    { name: '**!sobre**', value: 'Mostra informações sobre mim o criador do bot.' }
                )
                .setTimestamp()
                .setFooter({ text: 'Created by Rannis Archives' });

            message.channel.send({ embeds: [embed] });
        }
    });
}

module.exports = { help };

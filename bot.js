
const { items } = require("./commands/items");
const { talismans } = require("./commands/talismans");
const { weapons } = require("./commands/weapons");
const { boss } = require("./commands/boss");
const { sorceries } = require("./commands/sorceries");
const { incantations } = require("./commands/incantations");
const { places } = require("./commands/places");
const { summons } = require("./commands/summons");
const { help } = require("./commands/help");
const { aboutMe } = require("./commands/aboutMe");

function bot() {
    require('dotenv').config();
    const { Client, GatewayIntentBits, Partials } = require('discord.js');

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions,
        ],

        partials: [
            Partials.Message,
            Partials.GuildMember,
            Partials.Reaction,
            Partials.User,
            Partials.Channel,
        ],
    });

    client.setMaxListeners(20);

    client.on('ready', () => {
        console.log('O bot está online!');
    });

    client.login(process.env.TOKEN);

    items(client);
    talismans(client);
    weapons(client);
    boss(client);
    sorceries(client);
    incantations(client);
    places(client);
    summons(client);
    help(client);
    aboutMe(client);
}

module.exports = { bot };


  

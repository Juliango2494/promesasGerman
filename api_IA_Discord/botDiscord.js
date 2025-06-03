const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const TOKEN = "MTM3NjkwNTMwMTI0ODQ0MjQ0OQ.G8p3WK.X3YsbbTqbj1nxSD3Uo3CYUoDWJvMqYBRbrre9Y";
const CHANNEL_ID = "1304212091070320762";

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
    channel.send("¡Hola desde el bot! 🚀");
  } else {
    console.log("No se encontró el canal.");
  }
});

client.login(TOKEN);

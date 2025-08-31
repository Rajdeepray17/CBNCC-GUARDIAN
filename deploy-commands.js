//  deploy-commands.js
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder().setName('help').setDescription('Show help menu'),
  new SlashCommandBuilder().setName('ping').setDescription('Check bot latency'),
  new SlashCommandBuilder().setName('quote').setDescription('Random programming quote'),
  new SlashCommandBuilder()
    .setName('resource')
    .setDescription('Get resources for a topic')
    .addStringOption(opt => opt.setName('topic').setDescription('Topic name').setRequired(true)),
  new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Get a coding problem')
    .addStringOption(opt => opt.setName('difficulty').setDescription('easy/medium/hard').setRequired(false)),
  new SlashCommandBuilder()
    .setName('aptitude')
    .setDescription('Get aptitude/reasoning question')
    .addStringOption(opt => opt.setName('difficulty').setDescription('easy/medium/hard').setRequired(true)),
  new SlashCommandBuilder()
    .setName('teachme')
    .setDescription('Get YouTube playlists for a topic')
    .addStringOption(opt => opt.setName('topic').setDescription('e.g. python, ai ml, react js').setRequired(true)),
  new SlashCommandBuilder()
    .setName('code')
    .setDescription('Run code in Piston API')
    .addStringOption(opt => opt.setName('language').setDescription('Programming language').setRequired(true))
    .addStringOption(opt => opt.setName('source').setDescription('Code or "text"').setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands...');

    // Register globally
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('✅ Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

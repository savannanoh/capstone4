const create = require('./create.js');
const offer = require('./buttons/offer.js');
const clear = require('./buttons/clear.js');
const leave = require('./buttons/leave.js');
const reopen = require('./buttons/reopen.js');
const send = require('./buttons/send.js');
const intros = require('./intros.js');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token  = process.env.TOKEN;
const fs = require('node:fs');
const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES);
const client = new Client({ intents: myIntents, partials: ['MESSAGE'] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on("messageCreate", msg => { //generate instructions
  if (msg.member.permissionsIn(msg.channel).has("ADMINISTRATOR")){
    if (msg.content === "!start") {
      return intros.start_intro(msg);
    } else if (msg.content === "!help") {
      return intros.help_intro(msg);
    } else if (msg.content === "!archive") {
      return intros.archive_intro(msg);
    }
  }
});

client.on('interactionCreate', async interaction => {
  if(interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
  	if (!command) return;
  	try {
  		await command.execute(interaction);
  	} catch (error) {
  		console.error(error);
  		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  	}
  } else if(interaction.isButton()) {
    if(interaction.customId.startsWith('o')) { //offer help button
      offer.offer_help(client, interaction);
    } else if(interaction.customId.startsWith('c')) { //clear request button
      clear.remove_req(interaction);
    } else if(interaction.customId.startsWith('l')) { //delete channel button part 1
      leave.delete_channel(interaction);
    } else if(interaction.customId.startsWith('r')) { //re-open request
      reopen.reopen_req(interaction);
    } else if(interaction.customId.startsWith('d')) { //delete the channel button part 2
      await interaction.channel.delete();
    } else if(interaction.customId.startsWith('s')) { //send request button
      send.send_req(interaction);
    } else {
      return;
    }    
  } else {
    return;
  }
});

client.login(token);

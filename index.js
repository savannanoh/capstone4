const create = require('./create.js');
const offer = require('./offer.js');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token  = process.env.TOKEN;
const fs = require('node:fs');
const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ONE_DAY = 86400000;
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

///////////instructions//////////////
const help_string = 'Only the bot is able to post in this channel. The posts in this channel are anonymous requests for support. To send an anonymous request for support, use the `/request` command. Your request will appear here, where you can remove it. Only the person who made the request can remove it from this channel. Others can respond to a post by offering support. Offering support creates a private channel within the server between the person who requested support and the person who offered it. Once someone has offered support to a request, it will be moved from this channel to `#help-archive`. From there, the requester can remove the message or re-open the message, sending it back here where someone can offer help.';
const archive_string = 'Only the bot is able to post in this channel. The posts in this channel are anonymous requests for support that have been moved to here from `#help` because they have been offered help already. To send an anonymous request for support, use the `/request` command. Your request will appear in `#help`. Only the person who made the request can remove it from this channel. Only the requester can re-open a message, sending it back to `#help` where someone can offer help again.';
const request_string = 'Use this command to request help. Fill in `message` with any context on what you’d like support for. Use `urgent` to specify whether your request is urgent. Specifying an urgent request will ping everyone set to `available`. Fill in `looking-for` to specify whether you’re looking to vent, get advice, or just talk to someone. Fill in `support-type` to indicate whether you want to be supported only, would like to find mutual support, or are open to either. Once you fill in your request the bot will post on your behalf in `#help`, keeping you anonymous until someone offers to help you.';

const start_intro = new MessageEmbed()
  .setColor('#FDA50F')
  .setTitle('Welcome to the capstone test server!')
  .setDescription('The goal of this server is to test out the bot. The bot\'s job is to help facilitate 1:1 peer support for mental health. The main things to do here are 1) ask for support and 2) offer support.')	
  .addFields(
  { name: 'Using slash commands', value: 'To use slash commands, simply type \"/\" followed by the command. You can\'t type in this channel, but you can use these commands in `#commands`. The command you type won\'t be visible to anyone but you.' },
  { name: 'Using `/available`', value: 'Turn notifications for when someone needs urgent help on or off. These are off by default.', inline: true },
  { name: 'Using `/request`', value: request_string, inline: true },
  { name: 'Using `#help`', value: help_string },
  { name: 'Using `#help-archive`', value: archive_string },
);

const help_intro = new MessageEmbed()
  .setColor('#FDA50F')
  .setTitle('Using this channel')
  .setDescription(help_string);	

const archive_intro = new MessageEmbed()
  .setColor('#FDA50F')
  .setTitle('Using this channel')
  .setDescription(archive_string);	

client.on("messageCreate", msg => {
  if (msg.member.permissionsIn(msg.channel).has("ADMINISTRATOR")){
    if (msg.content === "!start") {
      return msg.channel.send({ embeds: [start_intro], ephemeral: false });
    } else if (msg.content === "!help") {
      return msg.channel.send({ embeds: [help_intro], ephemeral: false });
    } else if (msg.content === "!archive") {
      return msg.channel.send({ embeds: [archive_intro], ephemeral: false });
    }
  }
});
////////////////end instructions//////////////////

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
      if(interaction.customId.substring(1) === interaction.user.id) {
        await interaction.message.delete();
        await interaction.reply({ content: "Your request has been removed", ephemeral: true });
      } else {
        await interaction.reply({ content: "Only the person who requested can remove the request", ephemeral: true });
      } 
    } else if(interaction.customId.startsWith('l')) { //delete channel button part 1
      const fetchedChannel = interaction.member.guild.channels.cache.get(interaction.customId.substring(1));
      fetchedChannel.messages.fetch({ limit: 1 }).then(messages => {
        let lastMessage = messages.first();
        if ((Date.now() - lastMessage.createdTimestamp) > ONE_DAY/12) {
          const del_row = new MessageActionRow()
            .addComponents([
              new MessageButton()
                .setCustomId("delete")
                .setLabel('delete')
                .setStyle('DANGER')
            ]);
          interaction.reply({ content: "Are you sure you want to delete this channel? This action cannot be undone. To go back, click \"Dismiss message\"", components: [del_row], ephemeral: true });
        } else {
          interaction.reply({ content: "Looks like your conversation might still be active. After 2 hours of inactivity you may delete this conversation", ephemeral: true });
        }
      })
      .catch(console.error);
    } else if(interaction.customId.startsWith('r')) { //re-open request
      const re_id = interaction.customId.substring(1);
      if(re_id === interaction.user.id) {
        const c_id = 'c'+re_id;
        const o_id = 'o'+re_id;
        const re_row = new MessageActionRow()
          .addComponents([
            new MessageButton()
              .setCustomId(c_id)
              .setLabel('remove')
              .setStyle('SECONDARY'),
            new MessageButton()
            	.setCustomId(o_id)
            	.setLabel('offer help')
            	.setStyle('PRIMARY')
          ]);

        var re_embed = null;
        await interaction.message.embeds.forEach(async(e) => {
          re_embed = e;
        });
        
        const m = interaction.member.guild.channels.cache.find(c => c.name === "help").send({ embeds: [re_embed], components: [re_row] });
        await interaction.message.delete();
      } else {
        await interaction.reply({ content: "Only the person who requested can re-open the request", ephemeral: true });
      }
    } else if(interaction.customId.startsWith('d')) { //delete the channel button part 2
      await interaction.channel.delete();
    } else if(interaction.customId.startsWith('s')) { //send request button
      let role = interaction.member.guild.roles.cache.find(role => role.name === "available");
      const user = interaction.customId.substring(1);
      var req_embed = null;
      var urgent = false;
      
      interaction.message.embeds.forEach(async(e) => {
        if(req_embed === null) {
          req_embed = e;
          urgent = e.fields[0].value; //TODO
        }
      });

      const c_id = 'c'+user;
      const o_id = 'o'+user;
      const btns = new MessageActionRow()
        .addComponents([
          new MessageButton()
            .setCustomId(c_id)
            .setLabel('remove')
            .setStyle('SECONDARY'),
          new MessageButton()
          	.setCustomId(o_id)
          	.setLabel('offer help')
          	.setStyle('PRIMARY')
        ]);

      if(urgent.startsWith('t')) { //send urgent request 
        const m = await interaction.member.guild.channels.cache.find(c => c.name === "help").send({ content: `${role}`, embeds: [req_embed], components: [btns] });
      } else { //send non-urgent request
        const m = await interaction.member.guild.channels.cache.find(c => c.name === "help").send({ embeds: [req_embed], components: [btns] });
      }

      await interaction.update({ content: "Your request has been sent to `#help`. You can remove it by going to `#help` and clicking `remove` under your message", components: [], ephemeral: true });
    } else {
      return;
    }    
  } else {
    return;
  }
});

client.login(token);

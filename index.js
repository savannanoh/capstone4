/*
const Discord = require("discord.js")
const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ['MESSAGE'] });

const fs = require('node:fs');


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
})

client.login(process.env.TOKEN)
*/
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token  = process.env.TOKEN;
const category = process.env.CATEGORY_ID;
const fs = require('node:fs');
const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ONE_DAY = 86400000;

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES);
const client = new Client({ intents: myIntents, partials: ['MESSAGE'] });

//const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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
});

///////////instructions//////////////
  const help_string = 'Only the bot is able to post in this channel. The posts in this channel are anonymous requests for support. To send an anonymous request for support, use the `/request` command. Your request will appear here, where you can remove it. Only the person who made the request can remove it from this channel. Others can respond to a post by offering support. Offering support creates a private channel within the server between the person who requested support and the person who offered it. Once someone has offered support to a request, it will be moved from this channel to `#help-archive`. From there, the requester can remove the message or re-open the message, sending it back here where someone can offer help.';
  const archive_string = 'Only the bot is able to post in this channel. The posts in this channel are anonymous requests for support that have been moved to here from `#help` because they have been offered help already. To send an anonymous request for support, use the `/request` command. Your request will appear in `#help`. Only the person who made the request can remove it from this channel. Only the requester can re-open a message, sending it back to `#help` where someone can offer help again.';
  const start_intro = new MessageEmbed()
    .setColor('#FDA50F')
    .setTitle('Welcome to the capstone test server!')
    .setDescription('The goal of this server is to test out the bot. The bot\'s job is to help facilitate 1:1 peer support for mental health. The main things to do here are 1) ask for support and 2) offer support.')	
    .addFields(
		{ name: 'Using slash commands', value: 'To use slash commands, simply type \"/\" followed by the command. You can\'t type in this channel, but you can use these commands in `#commands`. The command you type won\'t be visible to anyone but you.' },
		//{ name: '\u200B', value: '\u200B' },
		{ name: 'Using `/available`', value: 'Turn notifications for when someone needs urgent help on or off. These are off by default.', inline: true },
		{ name: 'Using `/request`', value: 'Use this command to request help. Fill in `message` with any context on what you’d like support for. Use `urgent` to specify whether your request is urgent. Specifying an urgent request will ping everyone set to `available`. Fill in `looking-for` to specify whether you’re looking to vent, get advice, or just talk to someone. Fill in `support-type` to indicate whether you want to be supported only, would like to find mutual support, or are open to either. Once you fill in your request the bot will post on your behalf in `#help`, keeping you anonymous until someone offers to help you.', inline: true },
    //{ name: '\u200B', value: '\u200B' },
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
  //if (msg.author.guild_permissions.administrator) {
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
	//if (!interaction.isCommand() && !interaction.isButton()) return;

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
    console.log(interaction.customId);
    console.log(interaction.user.id);

    if(interaction.customId.startsWith('o')) {
      if(interaction.customId.substring(1) === interaction.user.id) {
        console.log('case1');
        //await interaction.update({ content: 'case1', components: [], ephemeral: true });
        await interaction.reply({ content: "You can't offer help on your own request. If you want to remove your request, click \"remove\"", ephemeral: true });
      } else {
        console.log('case2');
        console.log("interaction");
        console.log(interaction.message);
        //await interaction.update({ content: 'case2', components: [], ephemeral: true });
        await interaction.reply({ content: "Thank you for offering your support! You will be invited to a separate channel", ephemeral: true });    

        //send to help-archive
        var archive_embed = null;
        await interaction.message.embeds.forEach(async(e) => {
          console.log(e);
          archive_embed = e;
        });
        const id = interaction.customId.substring(1);
        const c_id = 'c'+id;
        const r_id = 'r'+id;
        const archive_row = new MessageActionRow()
        .addComponents([
          new MessageButton()
            .setCustomId(c_id)
            .setLabel('remove')
            .setStyle('SECONDARY'),
          new MessageButton()
          	.setCustomId(r_id)
          	.setLabel('re-open request (move back to #help)')
          	.setStyle('SECONDARY')
        ]);
        
        const m = interaction.member.guild.channels.cache.find(c => c.name === "help-archive").send({ embeds: [archive_embed], components: [archive_row] });


        await createPrivateChannel(interaction, interaction.customId.substring(1), interaction.message.id);
        await interaction.message.delete();
      }
    } else if(interaction.customId.startsWith('c')) {
      if(interaction.customId.substring(1) === interaction.user.id) {
        console.log('case3');
        //await interaction.update({ content: 'case3', components: [], ephemeral: true });
        await interaction.message.delete();
        await interaction.reply({ content: "Your request has been removed", ephemeral: true });
      } else {
        console.log('case4');
        await interaction.reply({ content: "Only the person who requested can remove the request", ephemeral: true });
        //await interaction.update({ content: 'case4', components: [], ephemeral: true });
      } 
    } else if(interaction.customId.startsWith('l')) {
      //const channel = await interaction.member.guild.channels.cache.find(c => c.name === interaction.customId.substring(1));
      const fetchedChannel = interaction.member.guild.channels.cache.get(interaction.customId.substring(1));
      console.log("leave channel" + fetchedChannel);


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
          //fetchedChannel.delete();
        } else {
          interaction.reply({ content: "Looks like your conversation might still be active. After 2 hours of inactivity you may delete this conversation", ephemeral: true });
        }
      })
      .catch(console.error);

      
      

      //await console.log("leave channel "+interaction.customId + channel + interaction.channel_id);

      const guild = interaction.member.guild;
      const everyoneRole = guild.roles.everyone;
      const id = interaction.user.id;
      const type = "member";


        //await interaction.channel.permissionOverwrites.edit(interaction.user.id, {VIEW_CHANNEL: false});
        //const permissionOverwrite = await fetchedChannel.permissionOverwrites.get(interaction.user.id);
        //if (permissionOverwrite) permissionOverwrite.delete().catch(console.error);
      
      /*
      await fetchedChannel.permissionOverwrites.set([
      {
        type: 'member', 
        id: id,
         deny: [Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        type: 'role',
         id: everyoneRole.id,
         deny: [Permissions.FLAGS.VIEW_CHANNEL],
      },
    ], 'Needed to change permissions');
    */

      //await fetchedChannel.permissionOverwrites.get(id).delete();
      
      //await Promise.all(fetchedChannel.permissionOverwrites.filter(o => o.type === type && ids.includes(o.id)).map(o => o.delete()));
      //await fetchedChannel.permissionOverwrites.find(o => o.type === type && o.id === id).delete();
    } else if(interaction.customId.startsWith('r')) {
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
          console.log(e);
          re_embed = e;
        });
        
        const m = interaction.member.guild.channels.cache.find(c => c.name === "help").send({ embeds: [re_embed], components: [re_row] });
        await interaction.message.delete();
      } else {
        await interaction.reply({ content: "Only the person who requested can re-open the request", ephemeral: true });
      }
    } else if(interaction.customId.startsWith('d')) {
      await interaction.channel.delete();
    } else if(interaction.customId.startsWith('s')) {
      //TODO
      const user = interaction.customId.substring(1);
      var req_embed = null;
      await interaction.message.embeds.forEach(async(e) => {
        console.log(e);
        if(req_embed === null) {
          req_embed = e;
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
      
      const m = await interaction.member.guild.channels.cache.find(c => c.name === "help").send({ embeds: [req_embed], components: [btns] });
      await interaction.update({ content: "Your request has been sent to `#help`. You can remove it by going to `#help` and clicking `remove` under your message", components: [], ephemeral: true });
      //await interaction.reply({ content: "Your request has been sent to `#help`. You can remove it by going to `#help` and clicking `remove` under your message", ephemeral: true });
      //await interaction.message.delete();
    } else {
      return;
    }
    
    //const filter = i => i.customId === 'primary' && i.user.id === '122157285790187530';
    //const filter = i => i.customId === 'primary'

    /*
    const filter = i => i.customId.substring(1) === i.user.id;
    
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
    
    collector.on('collect', async i => {
    	if (i.customId === 'primary') {
    		await i.update({ content: 'A button was clicked!', components: [] });
    	}
    });
    
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    */
    
  } else {
    return;
  }


});

client.login(token);

//async function createPrivateChannel(interaction, r_id, m_id) {
const createPrivateChannel = async function (interaction, r_id, m_id) {

  console.log(m_id);
  const o_id = interaction.user.id;
  const offerer = interaction.user;
  //const requester = client.users.get(r_id).username;

  //const requester = interaction.guild.members.get(r_id).displayName;
  const requester = client.users.cache.find(user => user.id === r_id);
  
  const guild = interaction.member.guild;
  const everyoneRole = guild.roles.everyone;
  const channel_name = requester.username+'-'+offerer.username;
  const channel = await guild.channels.create(channel_name, 'text');
  channel.setParent(category);
  //channel.send(`"${requester}, ${offerer}" welcome to your 1:1 space!`);
  //<@${id}>
  channel.send(`<@${r_id}>,  <@${o_id}>, welcome to your 1:1 space!`);
  //channel.send(interaction.message);
  /*
  console.log("interaction");
  console.log(interaction.message.embed);
  console.log("interaction options");
  console.log(interaction.options);
  */
  const help = await interaction.member.guild.channels.cache.find(c => c.name === "help");
  console.log("smth");
  //console.log(help);
  const orig_msg_id = await help.messages.fetch(m_id);
  console.log("smth2");
  //console.log(orig_msg_id);
  await orig_msg_id.embeds.forEach(async(e) => {
    console.log(e);
    const o = await channel.send({ content: "As a reminder, here's the original support request, copied from `#help`", embeds: [e] });
    o.pin();
  });


  //channel.send(orig_msg_id);
/*
  const orig_msg = orig_msg_id.options.getString("message");
  const orig_urgency = orig_msg_id.options.getBoolean("urgent");
  const orig_looking = orig_msg_id.options.getString("looking-for");
  const orig_support = orig_msg_id.options.getString("support-type");
  const orig_embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Original Message')
    .setDescription('Here\'s the request for support, copied from `#help`')
    .addFields(
  { name: 'Urgent', value: ''+orig_urgency, inline: true },
  { name: 'Looking for', value: ''+orig_looking, inline: true },
  { name: 'Support type', value: ''+orig_support, inline: true },
  { name: 'Message', value: ''+orig_msg, inline: false },
	);
  
  channel.send({ content: "As a reminder, here's the original support request", embeds: [orig_embed] });
*/
  
  const embed = new MessageEmbed()
    .setColor('#FDA50F')
    .setTitle('Guidelines, if you want them')
    .setURL('https://dl.acm.org/doi/10.1145/3173574.3173905')
    .setDescription('Please remember to defer to a professional when appropriate. If you feel like the conversation is problematic, please DM a moderator.');
  const msg = await channel.send({ content: "Here's a guide for a more structured conversation if you want it", embeds: [embed] });
  msg.pin();

    const row = new MessageActionRow()
      .addComponents([
        new MessageButton()
        	.setCustomId('l'+channel.id)
        	.setLabel('delete channel')
        	.setStyle('DANGER')
      ]);

    const leave = await channel.send({ content: "Press this button when you're ready to delete the channel. Once you delete it you will not be able to get it back", components: [row] });
  leave.pin();
  
  //msg.channel.send(exampleEmbed).then((msg) => msg.pin())
  

  /*
  await channel.updateOverwrite(message.member, {
    SEND_MESSAGES: true,
    VIEW_CHANNEL: true
});
*/

  
  await channel.permissionOverwrites.set([
  {
    type: 'member', 
    id: o_id,
     allow: [Permissions.FLAGS.VIEW_CHANNEL],
  },
  {
    type: 'member', 
    id: r_id,
     allow: [Permissions.FLAGS.VIEW_CHANNEL],
  },
  {
    type: 'role',
     id: everyoneRole.id,
     deny: [Permissions.FLAGS.VIEW_CHANNEL],
  },
], 'Needed to change permissions');

  
  /*
  const permissionOverwrites = [
    {type: 'member', id: offerer, allow: [Permissions.FLAGS.VIEW_CHANNEL]},
    {type: 'member', id: requester, allow: [Permissions.FLAGS.VIEW_CHANNEL]},
    {type: 'member', id: client.user.id, allow: [Permissions.FLAGS.VIEW_CHANNEL]},
    {type: 'role', id: everyoneRole.id, deny: [Permissions.FLAGS.VIEW_CHANNEL]},
  ];
  */

  //await channel.permissionsFor();
  //await channel.edit(permissionOverwrites);
  //await channel.permissionOverwrites

  /*
  await channel.overwritePermissions([
    {type: 'member', id: offerer, allow: [Permissions.FLAGS.VIEW_CHANNEL]},
    {type: 'member', id: requester, allow: [Permissions.FLAGS.VIEW_CHANNEL]},
    {type: 'member', id: client.user.id, allow: [Permissions.FLAGS.VIEW_CHANNEL]},
    {type: 'role', id: everyoneRole.id, deny: [Permissions.FLAGS.VIEW_CHANNEL]},
  ]);
  */
  
}
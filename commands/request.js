const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


/*
const row = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('primary')
      .setLabel('Primary')
      .setStyle('PRIMARY'),
  );
*/


module.exports = {
	data: new SlashCommandBuilder()
    .setName('request')
    .setDescription('Request support anonymously')
    .addStringOption(option => option
      .setName('message')
      .setDescription('message body')
      .setRequired(true))
    .addBooleanOption(option => option
      .setName('urgent')
      .setDescription('whether the message is urgent. Urgent messages notify all people set to available')
      .setRequired(true))
    .addStringOption(option => option
      .setName('looking-for')
      .setDescription('what are you looking for?')
      .setRequired(true)
      .addChoice('Advice', 'Looking for advice')
			.addChoice('Vent', 'Looking to vent')
      .addChoice('Just-want-to-talk', 'Looking to talk'))
    .addStringOption(option => option
      .setName('support-type')
      .setDescription('looking to be supported only vs open to mutual support')
      .setRequired(true)
      .addChoice('Be-supported', 'Non-mutual')
			.addChoice('Mutual', 'Mutual')
    	.addChoice('Either', 'Either mutual or non-mutual')),
	async execute(interaction) {
    const msg = interaction.options.getString("message");
    const urgency = interaction.options.getBoolean("urgent");
    const looking = interaction.options.getString("looking-for");
    const support = interaction.options.getString("support-type");

    //const user = client.users.cache.get(interaction.member.user.id);
    const user = interaction.member.user;

    let role = interaction.member.guild.roles.cache.find(role => role.name === "available");

    const embed_u = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Someone is looking for help`)
      .addFields(
  { name: 'Urgent', value: ''+urgency, inline: true },
  { name: 'Looking for', value: ''+looking, inline: true },
  { name: 'Support type', value: ''+support, inline: true },
  { name: 'Message', value: ''+msg, inline: false },
	);
    if(urgency) {
      embed_u.setColor('#D22B2B');
    }

    const c_id = 'c'+user;
    const o_id = 'o'+user;


    const row = new MessageActionRow()
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


    
    if(role && urgency) {
      /*const m = await interaction.member.guild.channels.cache.find(c => c.name === "help").send(`${role} someone"${user}" is looking for help`);
      if(msg != null && msg.length > 0) {
        m.reply(`${msg}`);
      }
      */


      /*
      if(msg != null && msg.length > 0) {
        embed_u.setDescription(`${msg}`);
      } 
      */
      
      //const m = await interaction.member.guild.channels.cache.find(c => c.name === "help").send({ content: `${role}`, embeds: [embed_u], components: [row] });
      //console.log(m.id);
      //await m.reply({ content: "this is your message", ephemeral: true });
      
      const info = new MessageEmbed()
        .setColor('#FDA50F')
        .setTitle('If you are in crisis, please contact a crisis line')
      .setURL('https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines')
        .setDescription('If you need immediate medical attention, please call 911');

      /*
      if(msg != null && msg.length > 0) {
        //embed.setDescription(`Your message: ${msg}`);
        embed.addField('Your message: ', `${msg}`, true);
      } 
      */

      const s_id = 's'+user;
      const send = new MessageActionRow()
      .addComponents([
        new MessageButton()
        	.setCustomId(s_id)
        	.setLabel('send')
        	.setStyle('SUCCESS')
      ]);


      await interaction.reply({ content: "Here's a preview of your request. Press `send` if/when you're ready to send it to `#help`", embeds: [embed_u, info], components: [send], ephemeral: true });
      //await interaction.followUp({ embeds: [info], ephemeral: true });

      //await interaction.reply({ content: "Your request has been sent to #help", embeds: [embed], components: [send], ephemeral: true });
      
    } else {
      /*
      const m = await interaction.member.guild.channels.cache.find(c => c.name === "help").send(`"${user}" is looking for help`);
      if(msg != null && msg.length > 0) {
        m.reply(`${msg}`);
      }
      */

      const info = new MessageEmbed()
        .setColor('#FDA50F')
        .setTitle('If you are in crisis, please contact a crisis line')
      .setURL('https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines')
        .setDescription('If you need immediate medical attention, please call 911');


      /*
      if(msg != null && msg.length > 0) {
        //embed.setDescription(`Your message: ${msg}`);
        embed.addField('Your message: ', `${msg}`, true);
      } 
      */

      /*
      const embed = new MessageEmbed()
        .setColor('#0099ff')
      	.setTitle('Your message');


      if(msg != null && msg.length > 0) {
        embed.setDescription(`${msg}`);
      } 
      */

      /*
      if(msg != null && msg.length > 0) {
        embed_u.setDescription(`${msg}`);
      } 
      */
      
      //const m = await interaction.member.guild.channels.cache.find(c => c.name === "help").send({ embeds: [embed_u], components: [row] });
      //await m.reply({ content: "this is your message", ephemeral: true });
      //console.log(m.id);

      const s_id = 's'+user;
      const send = new MessageActionRow()
      .addComponents([
        new MessageButton()
        	.setCustomId(s_id)
        	.setLabel('send')
        	.setStyle('SUCCESS')
      ]);



      await interaction.reply({ content: "Here's a preview of your request. Press `send` if/when you're ready to send it to `#help`", embeds: [embed_u, info], components: [send], ephemeral: true });

      //await interaction.followUp({ embeds: [info], ephemeral: true });

    }


    /*
    message.reply('This is a reply!')
  .then(() => console.log(`Replied to message "${message.content}"`))
  .catch(console.error);
    */
    
//user.send("Hello").catch(console.error);

	},
};
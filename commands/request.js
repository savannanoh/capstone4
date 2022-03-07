const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

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
      embed_u.setColor('#D22B2B'); //red
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
     
    const info = new MessageEmbed()
      .setColor('#FDA50F')
      .setTitle('If you are in crisis, please contact a crisis line')
      .setURL('https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines')
      .setDescription('If you need immediate medical attention, please call 911');

    const s_id = 's'+user;
    const send = new MessageActionRow()
    .addComponents([
      new MessageButton()
        .setCustomId(s_id)
        .setLabel('send')
        .setStyle('SUCCESS')
    ]);

    await interaction.reply({ content: "Here's a preview of your request. Press `send` if/when you're ready to send it to `#help`", embeds: [embed_u, info], components: [send], ephemeral: true });
	},
};
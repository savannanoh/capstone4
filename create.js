const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  
  create_private_channel : async function(client, interaction, r_id, m_id) {
    const category = process.env.CATEGORY_ID;
    const o_id = interaction.user.id;
    const offerer = interaction.user;
    const requester = client.users.cache.find(user => user.id === r_id);
    const guild = interaction.member.guild;
    const everyoneRole = guild.roles.everyone;
    const channel_name = requester.username+'-'+offerer.username;
    const channel = await guild.channels.create(channel_name, 'text');
    
    channel.setParent(category);
    channel.send(`<@${r_id}>,  <@${o_id}>, welcome to your 1:1 space!`);
  
    const help = await interaction.member.guild.channels.cache.find(c => c.name === "help");
    const orig_msg_id = await help.messages.fetch(m_id);
    await orig_msg_id.embeds.forEach(async(e) => {
      const o = await channel.send({ content: "As a reminder, here's the original support request, copied from `#help`", embeds: [e] });
      o.pin();
    });
   
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
  }
}
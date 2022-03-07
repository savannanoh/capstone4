const create = require('.././create.js');

const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  
  offer_help : async function(client, interaction) {
    if(interaction.customId.substring(1) === interaction.user.id) {
      await interaction.reply({ content: "You can't offer help on your own request. If you want to remove your request, click \"remove\"", ephemeral: true });
    } else {
      await interaction.reply({ content: "Thank you for offering your support! You will be invited to a separate channel", ephemeral: true });    
      
      //send to help-archive
      var archive_embed = null;
      await interaction.message.embeds.forEach(async(e) => {
        archive_embed = e;
      });
      const id = interaction.customId.substring(1);
      const c_id = 'c'+id; //clear request
      const r_id = 'r'+id; //re-open request
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
      await create.create_private_channel(client, interaction, interaction.customId.substring(1), interaction.message.id);
      //await createPrivateChannel(interaction, interaction.customId.substring(1), interaction.message.id);
      await interaction.message.delete();
    }
  }
}
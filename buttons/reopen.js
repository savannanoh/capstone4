const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  
  reopen_req : async function(interaction) {
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
  }
}
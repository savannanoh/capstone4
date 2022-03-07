const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  
  remove_req : async function(interaction) {
    if(interaction.customId.substring(1) === interaction.user.id) {
      await interaction.message.delete();
      await interaction.reply({ content: "Your request has been removed", ephemeral: true });
    } else {
      await interaction.reply({ content: "Only the person who requested can remove the request", ephemeral: true });
    } 
  }
}
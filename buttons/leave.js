const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ONE_DAY = 86400000;

module.exports = {
  
  delete_channel : async function(interaction) {
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
  }
}
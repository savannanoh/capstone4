const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  
  send_req : async function(interaction) {
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
  }
}
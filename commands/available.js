const { SlashCommandBuilder } = require('@discordjs/builders');
const role_name = "available";

module.exports = {
	data: new SlashCommandBuilder()
		.setName(role_name)
		.setDescription('get notifications when someone requests support')
    .addBooleanOption(option => option
    .setName('notify')
    .setDescription('whether you want to be notified when someone needs urgent help')
    .setRequired(true)),
  
	async execute(interaction) {
    const notify = interaction.options.getBoolean("notify");
    if(notify) {
      let role = interaction.member.guild.roles.cache.find(role => role.name === role_name);
      if (role) {
        if(interaction.member.roles.cache.some(role => role.name === role_name)) {
          //you already have this role
          return interaction.reply({ content: 'you are already marked as available', ephemeral: true });
        } else { interaction.guild.members.cache.get(interaction.member.user.id).roles.add(role);
          return interaction.reply({ content: 'you will now receive notifications for urgent requests', ephemeral: true });
        }
      }
    } else {
      let role = interaction.member.guild.roles.cache.find(role => role.name === role_name);
      if (role) {
        if(!interaction.member.roles.cache.some(role => role.name === role_name)) {
          //you already don't have this role
          return interaction.reply({ content: 'you are already marked as unavailable', ephemeral: true });
        } else {     
          interaction.guild.members.cache.get(interaction.member.user.id).roles.remove(role);
          return interaction.reply({ content: 'you will now NOT receive notifications for urgent requests', ephemeral: true });
        }
      }
    }
	},
};
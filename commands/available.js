const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('available')
		.setDescription('get notifications when someone requests support')
      .addBooleanOption(option => option
      .setName('notify')
      .setDescription('whether you want to be notified when someone needs urgent help')
      .setRequired(true)),
	async execute(interaction) {
    const notify = interaction.options.getBoolean("notify");
    if(notify) {
      console.log("available");
      let role = interaction.member.guild.roles.cache.find(role => role.name === "available");
      if (role) {
        if(interaction.member.roles.cache.some(role => role.name === 'available')) {
          //you already have this role
          return interaction.reply({ content: 'you are already marked as available', ephemeral: true });
        } else {
          interaction.guild.members.cache.get(interaction.member.user.id).roles.add(role);
          return interaction.reply({ content: 'you will now receive notifications for urgent requests', ephemeral: true });
        }

      }
    } else {
      console.log("not available");
      let role = interaction.member.guild.roles.cache.find(role => role.name === "available");
      if (role) {
        if(!interaction.member.roles.cache.some(role => role.name === 'available')) {
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
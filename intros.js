const { Client, Collection, Intents, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

  const help_string = 'Only the bot is able to post in this channel. The posts in this channel are anonymous requests for support. To send an anonymous request for support, use the `/request` command. Your request will appear here, where you can remove it. Only the person who made the request can remove it from this channel. Others can respond to a post by offering support. Offering support creates a private channel within the server between the person who requested support and the person who offered it. Once someone has offered support to a request, it will be moved from this channel to `#help-archive`. From there, the requester can remove the message or re-open the message, sending it back here where someone can offer help.';
  const archive_string = 'Only the bot is able to post in this channel. The posts in this channel are anonymous requests for support that have been moved to here from `#help` because they have been offered help already. To send an anonymous request for support, use the `/request` command. Your request will appear in `#help`. Only the person who made the request can remove it from this channel. Only the requester can re-open a message, sending it back to `#help` where someone can offer help again.';
  const request_string = 'Use this command to request help. Fill in `message` with any context on what you’d like support for. Use `urgent` to specify whether your request is urgent. Specifying an urgent request will ping everyone set to `available`. Fill in `looking-for` to specify whether you’re looking to vent, get advice, or just talk to someone. Fill in `support-type` to indicate whether you want to be supported only, would like to find mutual support, or are open to either. Once you fill in your request the bot will post on your behalf in `#help`, keeping you anonymous until someone offers to help you.';
  
  const start_intro = new MessageEmbed()
    .setColor('#FDA50F')
    .setTitle('Welcome to the capstone test server!')
    .setDescription('The goal of this server is to test out the bot. The bot\'s job is to help facilitate 1:1 peer support for mental health. The main things to do here are 1) ask for support and 2) offer support.')	
    .addFields(
    { name: 'Using slash commands', value: 'To use slash commands, simply type \"/\" followed by the command. You can\'t type in this channel, but you can use these commands in `#commands`. The command you type won\'t be visible to anyone but you.' },
    { name: 'Using `/available`', value: 'Turn notifications for when someone needs urgent help on or off. These are off by default.', inline: true },
    { name: 'Using `/request`', value: request_string, inline: true },
    { name: 'Using `#help`', value: help_string },
    { name: 'Using `#help-archive`', value: archive_string },
  );
  
  const help_intro = new MessageEmbed()
    .setColor('#FDA50F')
    .setTitle('Using this channel')
    .setDescription(help_string);	
  
  const archive_intro = new MessageEmbed()
    .setColor('#FDA50F')
    .setTitle('Using this channel')
    .setDescription(archive_string);	

module.exports = {

  start_intro : async function(msg) {
    return msg.channel.send({ embeds: [start_intro], ephemeral: false });
  },

  help_intro : async function(msg) {
    return msg.channel.send({ embeds: [help_intro], ephemeral: false });
  },

  archive_intro : async function(msg) {
    return msg.channel.send({ embeds: [archive_intro], ephemeral: false });
  }
}
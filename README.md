# Savanna-Project

My project is a Discord bot for facilitating peer mental health support. I wrote it using [discord.js](https://discord.js.org/).

## Disclaimer

In order to not have to sign up for a separate hosting service, the bot is hosted on Replit and was developed on there. Therefore, I haven't tried running the bot through any other means than Replit. The files are provided here simply for convenience. I don't recommend trying to run the bot by using this repo. 

## How to use the bot
If you just want to try out the bot without needing to modify any of the code yourself, the easiest thing to do is to message me, then I'll start up the bot and send you a link to the server it lives in. If you want to run the bot on your own server, keep reading.

## How to host the bot
### Prerequisites
To run the bot, you will need:
- A Replit account https://replit.com
- A Discord account https://discord.com
  
That's it! 

### Steps
#### Replit
1. In order to get my code, please go to this link: https://replit.com/@savannanoh/capstone4
2. Log in to your Replit account, and then you should be able to fork my repository by clicking the button in the top-right corner that says "fork repl".
3. Before you can run the bot, you need to set up the bot on your Discord
#### Discord
4. Turn on developer mode on your Discord account. (Click on the gear icon near the bottom by your avatar. Scroll down to "Advanced" on the left. Toggle Developer Mode on.)
5. Go to https://discord.com/developers/applications
6. Click the "New Application" button in the top-right
7. Name your bot, then click "Create"
8. Go to the "Bot" tab on the left
9. Click the "Add Bot" button on the right
10. Follow the default steps
11. Next to the picture of your bot should be the place you can copy or generate a token for your bot. Copy the token.
12. Go to the "OAuth2" tab on the left. Copy the client id.
13. Copy this server template: https://discord.new/6km4upwRyFES
14. After you've created the server, right click on the server's name and copy its ID
15. Right click on the channel category called "1:1 support" and copy its ID
#### Replit
16. Go to the left and click on the padlock icon. Add the following secrets:

- key="TOKEN" value=<what you copied in step 11\> 
- key="CLIENT_ID" value=<what you copied in step 12\> 
- key="GUILD_ID" value=<what you copied in step 14\> 
- key="CATEGORY_ID" value=<what you copied in step 15\> 

17. You should now be able to click the big green "Run" button at the top of your Replit window! Keep an eye on the console on the right hand side. Once it says "Ready!" the bot is up and running
18. The last thing you need to do is get the bot instructions. Go to the "start-here" channel and type "!start". You should see the bot respond with instructions.
19. Go to the "help" channel and type "!help". You should see the bot respond with instructions
20. Go to the "help-archive" channel and type "!archive". You should see the bot respond with instructions
21. The bot is now ready to help people support each other <3
    
## How to interact with the bot
The bot responds to slash commands.
To use slash commands, simply type "/" followed by the command. You can't type in this channel, but you can use these commands in `#commands`. The command you type won't be visible to anyone but you.

There are two commands you can use:
- **Using /available** Turn notifications for when someone needs urgent help on or off. These are off by default.
- **Using /request** Use this command to request help. Fill in `message` with any context on what you’d like support for. Use `urgent` to specify whether your request is urgent. Specifying an urgent request will ping everyone set to `available`. Fill in `looking-for` to specify whether you’re looking to vent, get advice, or just talk to someone. Fill in `support-type` to indicate whether you want to be supported only, would like to find mutual support, or are open to either. Once you fill in your request the bot will post on your behalf in `#help`, keeping you anonymous until someone offers to help you.

There are two channels to keep in mind:
- **Using `#help`** Only the bot is able to post in this channel. The posts in this channel are anonymous requests for support. To send an anonymous request for support, use the `/request` command. Your request will appear here, where you can remove it. Only the person who made the request can remove it from this channel. Others can respond to a post by offering support. Offering support creates a private channel within the server between the person who requested support and the person who offered it. Once someone has offered support to a request, it will be moved from this channel to `#help-archive`. From there, the requester can remove the message or re-open the message, sending it back here where someone can offer help.
- **Using `#help-archive`** Only the bot is able to post in this channel. The posts in this channel are anonymous requests for support that have been moved to here from `#help` because they have been offered help already. To send an anonymous request for support, use the `/request` command. Your request will appear in `#help`. Only the person who made the request can remove it from this channel. Only the requester can re-open a message, sending it back to `#help` where someone can offer help again.


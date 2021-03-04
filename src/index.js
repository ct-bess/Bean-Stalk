import Discord from "discord.js";
import auth from "../auth.json";
import help from "../help.json";
import guild from "../guild.json";
import config from "../config.json";
import { loadCommands, validateGuild } from "./loadCommands.js";
import { messageOps } from "./messageOps.js";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.var = {
  messageOpsEnabled: true,
  prefix: config.prefix || "-",
  guild: guild.id,
  emojis: guild.emoji,
  roles: guild.roles,
  members: guild.members,
  admins: guild.admins,
  bots: guild.bots,
  events: null,
  channels: guild.channels
}

bot.on( "ready", () => {
  console.info( "INITIATING BEAN STALK ..." );
  loadCommands( bot, null );
  validateGuild( bot );
  console.info( "Ready" );
});

bot.on( "message", ( message ) => {

  if( bot.var.messageOpsEnabled ) messageOps( message, bot );

  if( message.channel.type === "dm" && !message.author.bot ) {
    setTimeout( () => {
      bot.channels.resolve( bot.var.channels.commands ).send( message.content );
    }, 1000 );
    return;
  }

  const prefixCheck = message.content.startsWith( bot.var.prefix );

  if( !prefixCheck || ( !bot.var.bots.includes( message.author.id ) && message.author.bot ) ) return;

  const commandArgs = message.content.slice( bot.var.prefix.length ).toLowerCase().split( /\s+/, 2 );
  const command = bot.commands.get( commandArgs[0] ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArgs[0] ) );
  
  console.debug( "[ Command ] -", "User:", message.author.username, "Content:", message.content );

  if( !command ) {
    if( message.createdTimestamp % 2 === 0 ) message.reply( "bruHh" );
    //else message.reply( "run `-bean commands` for available commands\nthen pick a command and run `-COMMAND_NAME help`" );
    return;
  }

  try {
    if( commandArgs[1] === "help" ) {
      const helpEmbed = help[command.name] || {};
      helpEmbed.color = 0xffea00;
      helpEmbed.title = command.name + "";
      helpEmbed.description = command.description + "";
      helpEmbed.footer = {};
      helpEmbed.footer.text = "aliases: " + command.aliases.join(', ');
      message.channel.send({ embed: helpEmbed });
    }
    else {
      command.exec( message, bot );
    }
  }
  catch( error ) {
    console.error( error );
    message.reply( bot.var.emojis.lmao + " **WHO DID THIS?!?!**\n```diff\n" + error + "\n```" );
    bot.user.setStatus( "dnd" );
    // crazy idea, what if we randomly DMed the error to a random guild member?
  }
  
});

// export this to a file wowowowo
bot.setInterval( () => {
  try {
    const events = bot.var.events;
    const date = new Date();
    const currTime = date.getHours() + ":" + date.getMinutes();

    // Dailys and Weeklys
    if( !!events[currTime] ) {

      const currEvents = events[currTime]
      console.debug( "Found events for:", currTime );

      for( const key in currEvents ) {

        console.debug( "processing:", key );
        const eventObject = currEvents[key];

        if( !!eventObject["period"] ) {

          const period = parseInt( eventObject["period"] ) || 0;
          const validTrigger = ( date.getDay() + 1 ) % ( period ) === 0 ? true : false;
          console.debug( "Status:", period, validTrigger );

          if( validTrigger ) {
            // haha better hope these fields exist
            let attendees = "";
            for( const attendee of eventObject["attendees"] ) {
              attendees += `<@!${attendee}> `;
            }
            for( const role of eventObject["roles"] ) {
              attendees += `<&!${role}> `;
            }
            const response = !!eventObject["raw"] ? eventObject["description"] : {
              color: 0xffea00,
              title: key,
              description: eventObject["description"],
              fields: [
                {
                  name: "Time",
                  value: currTime
                },
                {
                  name: "Location",
                  value: `<#${eventObject["location"]}>`
                },
                {
                  name: "Period",
                  value: "Every " + eventObject["period"] + " day(s)"
                },
                {
                  name: "Occurances",
                  value: eventObject["occurances"]
                },
                {
                  name: "The Chads",
                  value: attendees || "none :triumph:"
                }
              ],
              footer: {
                text: "Sponsored by Bean-Stalk",
                icon_url: bot.user.displayAvatarURL()
              }
            };

            let alertChannel = null;

            if( bot.channels.cache.has( eventObject["location"] ) ) {
              alertChannel = bot.channels.resolve( eventObject["location"] );
              if( !alertChannel.isText() ) {
                alertChannel = bot.channels.resolve( bot.var.channels.commands );
                response.footer.text = "Yo this location ain't a text channel; So I'm droppin it here yo";
              }
            }
            else {
              alertChannel = bot.channels.resolve( bot.var.channels.commands );
              response.footer.text = "Yo this location ain't even real; So I'm droppin it here yo";
            }

            // putting silent logic here for now
            // also make sure to validate that the command exists
            // also maybe put a command call into a function???
            if( !eventObject["silent"] ) {

              // GALAXY BRAIN VERY WET
              alertChannel.send( typeof( response ) === "object" ? { embed: response } : response ).then( message => {
                try {
                  if( !!eventObject["command"] ) {
                    console.info( "executing event command:", eventObject.command );
                    // For now, let's make this replace to enable this nested command
                    message.content = eventObject.command.replace( /'/g, '"' );
                    const commandArgs = message.content.slice( bot.var.prefix.length ).toLowerCase().split( /\s+/, 2 );
                    const command = bot.commands.get( commandArgs[0] ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArgs[0] ) );
                    console.info( "command:", message.content );
                    setTimeout( () => { command.exec( message, bot ) }, 3000 )
                  }
                } 
                catch( error ) {
                  console.error( error );
                  message.channel.send( "event's command failed bro" );
                }
              });

            }
            // Nice one wow
            else {
              if( !!eventObject["command"] ) {
                const message = alertChannel.lastMessage;
                console.info( "executing event command:", eventObject.command );
                // For now, let's make this replace to enable this nested command
                message.content = eventObject.command.replace( /'/g, '"' );
                const commandArgs = message.content.slice( bot.var.prefix.length ).toLowerCase().split( /\s+/, 2 );
                const command = bot.commands.get( commandArgs[0] ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArgs[0] ) );
                console.info( "command:", message.content );
                command.exec( message, bot );
              }
            }

            ++eventObject["occurances"]

          } // EO event trigger

        } // EO valid event

      } // EO curr event loop

    } // EO event check

    // could run a check on date.toLocaleDateString() for hyper specifics

    // next, create a -collect command for the below:

    if( currTime === "16:19" ) {
      const filter = message => !!message.content;
      bot.channels.resolve( bot.var.channels.general ).awaitMessages( filter, { time: 120000 } ).then( collected => {
        let summary = "";
        collected.forEach( message => {
          const words = message.content.split(" ");
          summary += (words[ Math.floor( Math.random() * words.length ) || 0 ] + " ") || "";
        });
        if( summary.length > 0 ) bot.channels.resolve( bot.var.channels.general ).send( summary );
      });
    }
    else if( currTime === "16:20" ) {
      const randEmoji = bot.emojis.cache.random();
      const randRole = bot.guilds.resolve( bot.var.guild ).roles.cache.random();
      bot.channels.resolve( bot.var.channels.general ).send( `!echo $echo YOO <@&${randRole}> <:${randEmoji.name}:${randEmoji.id}> ${bot.var.emojis.blunt}` );
    }

  }
  catch( error ) {
    console.error( error );
  }

}, 60000 );

bot.on( "presenceUpdate", ( oldPresence, newPresence ) => {
  try {
    const who = (!!oldPresence ? oldPresence.userID : newPresence.userID) + "";
    // this will trigger multiple times if bean & user are in multiple servers; Check the guild to stop this
    if( who === bot.var.members.kenny || who === bot.var.members.emmy ) {
      //const risingEdge = !!oldPresence && oldPresence.status === "offline" && newPresence.status === "online";
      const risingEdge = !oldPresence && newPresence.status === "online";
      const fallingEdge = !!oldPresence && oldPresence.status === "online" && newPresence.status === "offline";
      console.info( "Kenny Presence ~", "rising edge:", risingEdge, "falling edge:", fallingEdge );
      if( risingEdge === true ) {
        if( who === bot.var.members.emmy ) {
          bot.channels.resolve( bot.var.channels.commands ).send( "Happy birthday Emmy!" );
          bot.user.setActivity( "MONKE MAIN SPOTTED" );
        }
        else {
          bot.channels.resolve( bot.var.channels.kenny ).send( `Hi ${bot.var.roles.kenny}` );
        //let kennyNewsletter = "Here's a list of server events for you\n";
        //bot.var.events.forEach( elem => { kennyNewsletter += `Name: **${elem.name}**\n` });
        //bot.channels.resolve( bot.var.channels.kenny ).send( kennyNewsletter );
          bot.user.setActivity( "KENNY SPOTTED" );
        }
      }
      if( fallingEdge === true ) {
        if( who === bot.var.members.emmy ) bot.user.setActivity( "SEE YOU DK" );
        else bot.user.setActivity( "SEE YOU SPACE MIATA" );
      }
    }
  }
  catch( error ) {
    console.error( "Kenny detection error:", error );
  }
});

bot.on( "messageDelete", ( message ) => {
  console.info( "message deleted", message.author.username, message.content );
  if( message.content.length > 0 ) message.channel.send( message.content );
});

bot.on( "channelCreate", ( channel ) => {
  //channel.setTopic( ":sweat_drops:" );
  if( channel.type === "dm" ) channel.send( "Hey scuse me big guy. I heard some noises goin on in here, couple minutes ago" );
  else if( channel.isText() ) channel.send( "Nice place" );
});

bot.on( "guildMemberAdd", ( member ) => {
  const hopefullyGeneral = member.guild.channel.cache.first();//firstKey();//first().id;
  hopefullyGeneral.send( `${guild.welcomeVideo} <@!${member.id}> :sweat_drops:` );
  //bot.channels.resolve( hopefullyGeneral ).send( `https://www.youtube.com/watch?v=hSjNTH-xcLY <@!${member.id}> :sweat_drops:` );
});

/* Not feelin these anymore
bot.on( "emojiCreate", ( emoji ) => {
  bot.channels.resolve( bot.var.channels.general ).send( `**SPICY NEW EMOTE** <:${emoji.name}:${emoji.id}>` );
});

bot.on( "emojiDelete", ( emoji ) => {
  bot.channels.resolve( bot.var.channels.general ).send( `***F*** <:${emoji.name}:${emoji.id}>` );
});

bot.on( "emojiUpdate", ( oldEmoji, newEmoji ) => {
  bot.channels.resolve( bot.var.channels.general ).send( `<:${oldEmoji.name}:${oldEmoji.id}> :arrow_right: <:${newEmoji.name}:${newEmoji}>` );
});
*/

bot.on( "rateLimit", ( rateLimitInfo ) => {
  console.warn( "Bean's Being Throttled", rateLimitInfo );
});

bot.login( auth.token );

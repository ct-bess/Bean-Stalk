import Discord from "discord.js";
import auth from "../auth.json";
import help from "../help.json";
import guild from "../guild.json";
import { loadCommands, validateGuild } from "./loadCommands.js";
import { messageOps } from "./messageOps.js";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.var = {
  messageOpsEnabled: true,
  events: new Discord.Collection(),
  guild: guild.id,
  emojis: guild.emoji,
  roles: guild.roles,
  members: guild.members,
  admins: guild.admins,
  bots: guild.bots,
  channels: guild.channels
}

bot.on( "ready", () => {
  console.info( "INITIATING BEAN STALK ..." );
  loadCommands( bot, null );
  validateGuild( bot );
  console.info( "Channels:", bot.var.channels );
  console.info( "Emojis:", bot.var.emojis );
  console.info( "Roles:", bot.var.roles );
  console.info( "Members:", bot.var.members );
  console.info( "Bots:", bot.var.bots );
  console.info( "Admins:", bot.var.admins );
  console.info( "Ready" );
});

bot.on( "message", ( message ) => {

  if( bot.var.messageOpsEnabled ) messageOps( message, bot );

  if( message.channel.type === "dm" && !message.author.bot ) {
    bot.channels.resolve( bot.var.channels.commands ).send( message.content );
    return;
  }

  const prefixCheck = message.content.startsWith( "-" );

  if( !prefixCheck || ( !bot.var.bots.includes( message.author.id ) && message.author.bot ) ) return;

  const commandArgs = message.content.slice( 1 ).toLowerCase().split( /\s+/, 2 );
  const command = bot.commands.get( commandArgs[0] ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArgs[0] ) );
  
  console.debug( "[ DEBUG ] -", "User:", message.author.username, "Content:", message.content );

  if( !command ) {
    if( message.createdTimestamp % 2 === 0 ) message.reply( "bruHh" );
    else message.reply( "run `-bean commands` for available commands\nthen pick a command and run `-COMMAND_NAME help`" );
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
    message.reply( "**WHO DID THIS?!?!** :joy:\n```diff\n" + error + "\n```" );
    bot.user.setStatus( "dnd" );
  }
  
});

bot.setInterval( () => {
  try {
    const date = new Date();
    const currTime = (date.getHours() * 100) + date.getMinutes();

    if( currTime === 1619 ) {
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
    else if( currTime === 1620 ) {
      const randEmoji = bot.emojis.cache.random();
      const randRole = bot.guilds.resolve( bot.var.guild ).roles.cache.random();
      bot.channels.resolve( bot.var.channels.general ).send( `!echo YOO <@&${randRole}> <:${randEmoji.name}:${randEmoji.id}> ${bot.var.emojis.blunt}` );
    }

    const events = bot.var.events.filter( elem => elem.hasNotification && ((elem.date.getHours() * 100) + elem.date.getMinutes()) == currTime );
    console.info( currTime, events );
    // Yeah cool, but what about a 24hour reminder?
    // -- So add a .notification property: [ 'once', '24hr reminder', '30min reminder' ]
    // also can we schedule this interval to be 'on the minute'?
    // also what if it was only in 30/60 minute intervals? People don't normally start a thing at 5:37
    events.forEach( elem => {
      const freq = (elem.frequency + "").toLowerCase();
      const eventDate = ((elem.date.getMonth() * 100) + elem.date.getDay());
      const currDate = (date.getMonth() * 100) + date.getDay();
      let validNotification = false;
      if( eventDate == currDate && (freq === "once" || freq === "one-off") ) {
        elem.hasNotification = false;
        validNotification = true;
      }
      else if( freq === "daily" || ( freq === "weekly" && elem.date.getDate() == date.getDate() ) ) {
        validNotification = true;
      }

      console.debug( freq, eventDate, currDate, validNotification );

      if( validNotification ) {
        ++elem.times;
        let peeps = "";
        for( const i of elem.participants ) {
          peeps += !!i.name ? `<@!${i.id}> ` : "";
        }
        bot.channels.resolve( bot.var.channels.commands ).send( `IT'S TIME FOR **${elem.name}** :sweat_drops:\n` + peeps );
      }

    });
  }
  catch( error ) {
    console.error( "bot interval error: date", date, "currTime", currTime );
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
  message.channel.send( message.content );
});

bot.on( "channelCreate", ( channel ) => {
  //channel.setTopic( ":sweat_drops:" );
  if ( channel.isText() ) channel.send( "hey" );
});

bot.on( "guildMemberAdd", ( member ) => {
  bot.channels.resolve( bot.var.channels.general ).send( `hi <@!${member.id}> :sweat_drops:` );
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

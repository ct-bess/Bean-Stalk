import Discord from "discord.js";
import auth from "../auth.json";
import help from "../help.json";
import { loadCommands } from "./loadCommands.js";
import { messageOps } from "./messageOps.js";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.var = {
  messageOpsEnabled: true,
  events: new Discord.Collection(),
  channels: {
    // Yes
    general: "499279740935471109",
    testing: "600120077446021131",
    dev: "600059491144433665",
    kenny: "519207339455414293"
  }
}

bot.on( "ready", () => {
  loadCommands( bot, null );
  //console.info( "Commands:", bot.commands );
  //console.info( "events:", bot.var.events );
  console.info( `Bean Stalk is in: ${bot.user.tag}` );
  //console.info( bot.channels );
  //bot.channels.resolve( bot.var.channels.testing ).send( "yo" );
});

bot.on( "message", ( message ) => {

  if( bot.var.messageOpsEnabled ) messageOps( message );

  const prefixCheck = message.content.startsWith( "-" );

  if( !prefixCheck || message.author.bot ) return;

  const commandArgs = message.content.slice( 1 ).toLowerCase().split( /\s+/, 2 );
  const command = bot.commands.get( commandArgs[0] ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArgs[0] ) );
  
  console.debug( "[DEBUG] -", "User:", message.author.username, "Content:", message.content );

  if( !command ) {
    message.reply( "bruHh" );
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
    message.reply( "**WHO DID THIS?!?!** :joy:\n" + "```diff\n" + error + "\n```" );
  }
  
});

// add some try catch bro
bot.setInterval( () => {
  const date = new Date();
  const currTime = (date.getHours() * 100) + date.getMinutes();

  if( currTime == 1620 ) {
    bot.channels.resolve( bot.var.channels.general ).send( "<:blunt:766311145341845504>" );
  }

  const events = bot.var.events.filter( elem => elem.hasNotification && ((elem.date.getHours() * 100) + elem.date.getMinutes()) == currTime );
  console.info( currTime, events );
  // Yeah cool, but what about a 24hour reminder?
  // also can we schedule this interval to be 'on the minute'?
  // also what if it was only in 30/60 minute intervals? People don't normally start a thing at 5:37
  events.forEach( elem => {
    const freq = elem.frequency;
    const eventDate = ((elem.date.getMonth() * 100) + elem.date.getDay());
    const currDate = (date.getMonth() * 100) + date.getDay();
    let validNotification = false;
    if( freq == "one-off" && eventDate == currDate ) {
      elem.hasNotification = false;
      validNotification = true;
    }
    else if( freq == "daily" || ( freq == "weekly" && elem.date.getDate() == date.getDate() ) ) {
      validNotification = true;
    }

    console.debug( freq, eventDate, currDate, validNotification );

    if( validNotification ) {
      ++elem.times;
      let peeps = "";
      for( const i of elem.participants ) {
        peeps += !!i.name ? `<@!${i.id}> ` : "";
      }
      bot.channels.resolve( bot.var.channels.testing ).send( `IT'S TIME FOR **${elem.name}**: ` + peeps );
    }

  });

}, 60000 );

bot.on( "presenceUpdate", ( oldPresence, newPresence ) => {
  const username = newPresence.user.username.toLowerCase();

  // this will trigger multiple times if bean & user are in multiple servers; Check the guild to stop this
  if( username === "diekommissar" ) {
    const risingEdge = !!oldPresence && oldPresence.status === "offline" && newPresence.status === "online";
    const fallingEdge = !!oldPresence && oldPresence.status === "online" && newPresence.status === "offline";
    // @kennyRole to notify them kenny is online
    // Play tripoloski when kenny logs in
    // paly sad poloski when kenny leaves
    if( risingEdge === true ) {
      console.info( "Kenny:", newPresence.user );
      bot.channels.resolve( bot.var.channels.kenny ).send( `Hi <@!${newPresence.user.id}>\n${newPresence.user.displayAvatarURL()}` );
      // kennyNewsletter 2.0 = markov chain or advanced AI system that has fish move out of the way when you swim close to them
      let kennyNewsletter = "Here's a list of server events for you\n";
      bot.var.events.forEach( elem => { kennyNewsletter += `Name: **${elem.name}**\n` });
      bot.channels.resolve( bot.var.channels.kenny ).send( kennyNewsletter );
      bot.channels.resolve( bot.var.channels.kenny ).send( "Run the command `-event show EVENT_NAME` for more details" );
      bot.user.setActivity( "KENNY SPOTTED" );
    }
    if( fallingEdge === true ) {
      bot.channels.resolve( bot.var.channels.kenny ).send( `Bye ken man :cry:` );
      bot.user.setActivity( "GOOD BYE KEN MAN" );
    }
  }
});

bot.on( "messageDelete", ( message ) => {
  console.info( "message deleted", message.author.username, message.content );
  message.channel.send( message.content );
  //message.reply( message.content );
});

bot.on( "channelCreate", ( channel ) => {
  channel.setTopic( ":sweat_drops:" );
});

bot.on( "guildMemberAdd", ( member ) => {
  bot.channels.resolve( bot.var.channels.general ).send( `***WELCOME TO THE COMMUNE*** ${member} :sweat_drops:` );
});

bot.on( "emojiCreate", ( emoji ) => {
  bot.channels.resolve( bot.var.channels.general ).send( `**SPICY NEW EMOTE** ${emoji}` );
});

bot.on( "emojiDelete", ( emoji ) => {
  bot.channels.resolve( bot.var.channels.general ).send( `***F*** ${emoji}` );
});

bot.on( "emojiUpdate", ( oldEmoji, newEmoji ) => {
  bot.channels.resolve( bot.var.channels.general ).send( `${oldEmoji} changed to: ${newEmoji}` );
});

bot.on( "rateLimit", ( rateLimitInfo ) => {
  console.warn( "Bean's Being Throttled", rateLimitInfo );
  //const response = "Chill BruH\n```" + rateLimitInfo.limit + "\n" + rateLimitInfo.method + "\n" + rateLimitInfo.timeout + "\n```";
  //bot.channels.resolve( bot.var.channels.dev ).send( response );
});

bot.login( auth.token );

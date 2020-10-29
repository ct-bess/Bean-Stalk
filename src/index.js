import Discord from "discord.js";
import auth from "../auth.json";
import help from "../help.json";
import { loadCommands } from "./loadCommands.js";
import { messageOps } from "./messageOps.js";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.var = {
  messageOpsEnabled: true,
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
    if( /^-?-?h(?:elp)?$/i.test( commandArgs[1] ) ) {
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

bot.setInterval( () => {
  const date = new Date();
  //console.info( "hours/mins:", date.getHours(), date.getMinutes() );
  if( date.getHours() == 16 && date.getMinutes() == 20 ) {
    bot.channels.resolve( bot.var.channels.general ).send( "<:blunt:766311145341845504>" );
  }
  // this is where we'll check events if that command ever happens
}, 45000 );

bot.on( "presenceUpdate", ( oldPresence, newPresence ) => {
  const username = newPresence.user.username.toLowerCase();
  const risingEdge = !!oldPresence && oldPresence.status !== "online" && newPresence.status === "online";

  // why does this still trigger twice?
  if( username === "wonpons" && risingEdge ) {
    console.info( "wonpons update:", risingEdge );
    //bot.channels.resolve( bot.var.channels.testing ).send( newPresence.user.displayAvatarURL() );
  }
  if( username === "diekommissar" && risingEdge ) {
    bot.channels.resolve( bot.var.channels.kenny ).send( newPresence.user.displayAvatarURL() );
    bot.user.setActivity( "KENNY SPOTTED" );
  }
});

bot.on( "messageDelete", ( message ) => {
  //message.reply( "bru you can't do that" );
  console.info( "message deleted", message.author.username, message.content );
  message.channel.send( message.content );
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

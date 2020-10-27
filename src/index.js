import Discord from "discord.js";
import auth from "../auth.json";
import help from "../help.json";
import { loadCommands } from "./loadCommands.js";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

bot.on( "ready", () => {
  loadCommands( bot, null );
  console.info( "Commands:", bot.commands );
  console.info( `Bean Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", ( message ) => {

  // FYI: apparently the proper way to get a custom emoji is this:
  // message.guild.emojis.cache.get("12345678...")

  if( /420|weed/i.test( message.content ) ) {
    message.react( ":blunt:766311145341845504" );
  }

  const prefixCheck = message.content.startsWith( "-" );

  if( message.createdTimestamp % 69 === 0 ) {
    message.react( "\u0036\u20E3" );
    message.react( "\u0039\u20E3" );
  }
  // 0x5f3759df = 99841437 in base ten
  else if( message.createdTimestamp % 0x5f3759df === 0 ) message.reply( "**// what the fuck?** https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552" );

  if( !prefixCheck || message.author.bot ) return;

  //console.group( `cmd-${message.author}` );
  //console.time( `cmd-${message.author}` );
  //message.channel.startTyping();

  const commandArgs = message.content.slice( 1 ).toLowerCase().split( /\s+/, 2 );
  const command = bot.commands.get( commandArgs[0] ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArgs[0] ) );
  
  console.debug( "[DEBUG] -", "User:", message.author.username, "Content:", message.content );

  if( !command ) {
    message.reply( "bruHh" );
    return;
  }

  try {
    if( /^-?-?h(?:elp)?$/i.test( commandArgs[1] ) ) {
      message.channel.send({ embed: help[`${command.name}`] } || `No help object for ${command.name}`);
    }
    else {
      command.exec( message, bot );
    }
  }
  catch( error ) {
    console.error( error );
    message.reply( "**WHO DID THIS?!?!** :joy:\n" + "```diff\n" + error + "\n```" );
  }

  //message.channel.stopTyping();
  //console.timeEnd( `cmd-${message.author}` );
  //console.groupEnd( `cmd-${message.author}` );
  
});

bot.login( auth.token );

import Discord from "discord.js";
import auth from "../auth.json";
import { exec } from "child_process";
import { loadCommands } from "./loadCommands.js";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

bot.on( "ready", () => {
  loadCommands( bot, null );
  console.info( "Commands:", bot.commands );
  console.info( `Bean Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", ( message ) => {

  const prefixCheck = message.content.startsWith( "-" );

  if( message.createdTimestamp % 69 === 0 ) message.reply( "69 lmao" );
  else if( message.createdTimestamp % 0x5f3759df === 0 ) message.reply( "**// what the fuck?** https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552" );

  //const sanitizedMessage = message.content.replace( "'", '"' );
  //const sanitizedName = message.author.username.replace( " ", "_" );
  //exec( `echo '${sanitizedMessage}' >> kb/${sanitizedName}.kb` );

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
    // Include: usage, and examples here next
    if( /^-?-?h(?:elp)?$/i.test( commandArgs[1] ) ) {
      message.channel.send( `**${command.name}**:\n${command.description}\nAliases:\`${command.aliases}\`` );
      message.channel.send( "**Options:**\n" + command.options.join( '\n' ) );
      message.channel.send( "**Examples:**\n" + command.examples.join( '\n' ) );
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

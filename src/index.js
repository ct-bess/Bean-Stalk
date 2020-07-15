import Discord from "discord.js";
import auth from "../auth.json";
import { exec } from "child_process";
import { loadCommands } from "./loadCommands.js";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

let botConfig = {
  deepListening: true
};

bot.on( "ready", () => {
  loadCommands( bot, false );
  console.info( "Commands:", bot.commands );
  console.info( `Bean Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", ( message ) => {

  //const prefixCheck = /^[^-]/.test( message.content );
  const prefixCheck = message.content.startsWith( "-" );

  if( message.createdTimestamp % 69 === 0 ) message.reply( "69 lmao" );

  if( !prefixCheck || message.author.bot ) return;

  if( botConfig.deepListening ) {
    const sanitizedMessage = message.content.replace( /"/g, "" );
    const sanitizedName = message.author.username.replace( /\s/g, "_" );
    exec( `echo "${sanitizedMessage}" >> kb/${sanitizedName}.kb` );
  }

  const args = message.content.slice( 1 ).split( /\s+/ );
  const commandName = args.shift().toLowerCase();
  const command = bot.commands.get( commandName ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandName ) );
  
  console.debug( "Content:", message.content );
  console.debug( "Author:", message.author.username );
  console.debug( "args:", args );

  if( !command ) {
    message.reply( "bruHh" );
    return;
  }

  try {
    if( /help/i.test( args[0] ) ) {
      message.channel.send( `**${command.name}**:\n${command.description}\nAliases:\`${command.aliases}\`` );
    }
    // Do the system commands better, and maybe restrict access
    else if( command.name === "system" ) {
      command.exec( message, args, bot );
    }
    else {
      command.exec( message, args );
    }
  }
  catch( error ) {
    console.error( error );
    message.reply( "**WHO DID THIS?!?!** :joy:\n" + "```diff\n" + error + "\n```" );
  }
  
});

bot.login( auth.token );

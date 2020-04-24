import Discord from "discord.js";
import auth from "../auth.json";
import { execSync } from "child_process";

const bot = new Discord.Client();
//bot.commands = new Discord.Collection();

let debug = true;

function loadCommands( cache ) {
  bot.commands = new Discord.Collection();
  const commandFiles = execSync( "ls lib/commands/ | grep \.js" ).toString().split( /\s/ );
  for( const file of commandFiles ) {
    console.info( "=> ", file );
    if( !!file ) {
      if( !!cache ) delete require.cache[ require.resolve( `./commands/${file}` ) ];
      const command = require( `./commands/${file}` );
      bot.commands.set( command.default.name, command.default );
    }
  }
}

bot.on( "ready", () => {
  loadCommands( 0 );
  console.log( "Commands:", bot.commands );
  console.log( `Bean-Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", ( message ) => {

  if( !message.content.startsWith( "-" ) || message.author.bot ) return;

  // -- Code split these
  if( message.content === "-die" ) { 
    message.reply( ":sob:" );
    bot.destroy();
  }

  if( message.content === "-reload" ) {
    console.info( "***\nSIX HOT RELOADS\n***" );
    const status = execSync( "babel src/commands -d lib/commands" ).toString();
    message.channel.send( `\`${status}\`` );
    loadCommands( 1 );
    console.log( "Loaded Commands:", bot.commands );
    message.channel.send( ":sweat_drops: SIX :sweat_drops: HOT :sweat_drops: RELOADS :sweat_drops:" );
    return;
  }
  // -- EO Code split these

  const args = message.content.slice( 1 ).split( /\s+/ );
  const commandName = args.shift();
  const command = bot.commands.get( commandName ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandName ) );
  
  if( debug ) {
    console.debug( "Content:", message.content );
    console.debug( "Author:", message.author.username );
    console.debug( "args:", args );
  }

  if( !command ) return;

  try {
    if( /help/i.test( args[0] ) ) {
      message.channel.send( command.description );
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

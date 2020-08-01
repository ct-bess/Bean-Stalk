import { execSync } from "child_process";

export const loadCommands = ( bot, singularCommand ) => {
  if( !!singularCommand ) {
    if( !!require.cache[ require.resolve( `./commands/${singularCommand}` ) ] ) {
      delete require.cache[ require.resolve( `./commands/${singularCommand}` ) ];
    }
    const command = require( `./commands/${singularCommand}` );
    bot.commands.set( command.default.name, command.default );
  }
  else {
    const commandFiles = execSync( "ls lib/commands/ | grep \.js" ).toString().split( /\s/ );
    for( const file of commandFiles ) {
      console.info( "=> ", file );
      if( !!file ) {
        if( !!require.cache[ require.resolve( `./commands/${file}` ) ] ) {
          delete require.cache[ require.resolve( `./commands/${file}` ) ];
        }
        const command = require( `./commands/${file}` );
        bot.commands.set( command.default.name, command.default );
      }
    }
  }
};

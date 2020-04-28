import { execSync } from "child_process";

export const loadCommands = ( bot, cached ) => {
  const commandFiles = execSync( "ls lib/commands/ | grep \.js" ).toString().split( /\s/ );
  for( const file of commandFiles ) {
    console.info( "=> ", file );
    if( !!file ) {
      if( !!cached ) delete require.cache[ require.resolve( `./commands/${file}` ) ];
      const command = require( `./commands/${file}` );
      bot.commands.set( command.default.name, command.default );
    }
  }
};

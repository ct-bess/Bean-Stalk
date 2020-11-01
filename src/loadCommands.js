import { execSync } from "child_process";
import events from "../events.json"; // <-- init as []

export const loadCommands = ( bot, singularCommand ) => {
  if( !!singularCommand ) {
    if( !!require.cache[ require.resolve( `./commands/${singularCommand}` ) ] ) {
      delete require.cache[ require.resolve( `./commands/${singularCommand}` ) ];
    }
    const command = require( `./commands/${singularCommand}` );
    bot.commands.set( command.default.name, command.default );
  }
  else {
    // On Wednesdays We Kode
    const commandFiles = [
      ...execSync( "ls lib/commands/ | grep \.js" ).toString().split( /\s/ ),
      ...execSync( "ls lib/commands/.ccs/ | grep \.js | sed -E \"s/^(.+)/.ccs\\/\\1/\"" ).toString().split( /\s/ ) 
    ]
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
    // load events saved by events command
    console.info( "Setting events..." );
    //if( !!require.cache[ require.resolve( "../events.json" ) ] ) {
      //delete require.cache[ require.resolve( "../events.json" ) ];
    //}
    for( let event in events ) {
      events[event].date = new Date( events[event].date );
      console.info( "=>", events[event].name );
      //console.info( events[event] );
      bot.var.events.set( events[event].name, events[event] );
    }
  }
};

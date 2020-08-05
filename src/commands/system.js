import { execSync } from "child_process";
import { exit } from "process";
import { loadCommands } from "../loadCommands.js";

export default {
  name: "system",
  description: "Bean Stalk system commands",
  options: [
    "`reload <?command name>`\ttranspile and reload commands; Defaults to all commands",
    "`die`\tLog out Bean Stalk",
    "`commands`\tList all commands"
  ],
  examples: [ "`system reload`", "`bean die`" ],
  aliases: [ "sys", "bean" ],
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/ );
    args.shift();
    switch( args[0] ) { 
      case "reload":
        let status = null;
        if( !!args[1] ) {
          status = execSync( `babel src/commands/${args[1]} -o lib/commands/${args[1]}` ).toString() || args[1];
          loadCommands( bot, args[1] );
          console.info( `Re-loaded ${args[1]} command` );
        }
        else {
          status = execSync( "babel src/commands -d lib/commands" ).toString();
          loadCommands( bot, null );
          console.info( "Re-loaded all commands" );
        }
        message.channel.send( "```fix\n" + status + "\n```" );
        message.channel.send( ":sweat_drops: **SIX** :sweat_drops: **HOT** :sweat_drops: **RELOADS** :sweat_drops:" );
      break;
      case "die":
        message.reply( ":sob:" );
        bot.destroy();
        exit( 0 );
      case "commands":
        let response = "";
        bot.commands.every( elem => response += `**${elem.name}**\n${elem.description}\n---\n` );
        message.channel.send( response );
      break;
      default:
        console.warn( `system command ${args[0]} not found` );
        message.channel.send( `subcommand ${args[0]} not found` );
    }
  }
}
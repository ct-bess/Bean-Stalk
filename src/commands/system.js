import { execSync } from "child_process";
import { exit } from "process";
import { loadCommands } from "../loadCommands.js";
import { sendBulk } from "../sendBulk.js";

export default {
  name: "system",
  description: "Bean Stalk system commands",
  aliases: [ "sys", "bean" ],
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/ );
    args.shift();
    switch( args[0] ) { 
      case "reload":
        let status = null;
        let response = "";
        if( !!args[1] ) {
          // -- Potential bash injection here
          status = execSync( `babel src/commands/${args[1]}.js -o lib/commands/${args[1]}.js` ).toString() || args[1];
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
        message.channel.send( "cya" );
        bot.destroy();
        exit( 0 );
      case "commands":
        response = "";
        bot.commands.every( elem => response += `Name: **${elem.name}**\tDescription: ${elem.description}\n` );
        if( response.length > 2000 ) sendBulk( response, message, null );
        else message.channel.send( response );
      break;
      case "vrms":
        response = execSync( "vrms" ).toString() || "exec vrms error";
        sendBulk( response, message, "code block" );
      break;
      case "screenfetch":
        response = execSync( "screenfetch -N" ).toString() || "exec screenfetch error";
        response = response.replace( /`/g, "'" );
        message.channel.send( "```\n" + response + "\n```" );
      break;
      default:
        console.warn( `system command ${args[0]} not found` );
        message.channel.send( `subcommand ${args[0]} not found` );
    }
  }
}
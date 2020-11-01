import { execSync } from "child_process";
import { exit } from "process";
import { loadCommands } from "../loadCommands.js";
import { sendBulk } from "../sendBulk.js";
import { writeFileSync } from "fs"

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
        console.info( "saving events..." );
        writeFileSync( "events.json", JSON.stringify( bot.var.events ), error => { console.error(error) });
        console.info( "saved events" );
        message.channel.send( "cya" );
        bot.destroy();
        exit( 0 );
      case "commands":
        response = "";
        bot.commands.every( elem => response += `Name: **${elem.name}**\tDescription: ${elem.description}\n` );
        if( response.length > 2000 ) sendBulk( response, message, null );
        else message.channel.send( response );
      break;
      case "msgOps":
      case "messageOps":
      case "regex":
        const ops = !!args[1] && (args[1] == 0 || args[1] == "off") ? false : true;
        bot.var.messageOpsEnabled = ops;
        message.channel.send( ops ? "***I HAVE AWAKENED***" : "I sleep" );
        break;
      case "uptime":
        const totMinutes = Math.floor( bot.uptime / 60000 );
        const minutes = Math.floor( totMinutes % 60 );
        const totHours = Math.floor( totMinutes / 60 );
        message.channel.send( `${totHours < 10 ? "0"+totHours : totHours}:${minutes < 10 ? "0"+minutes : minutes}` );
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
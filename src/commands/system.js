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
    const isAdmin = bot.var.admins.includes( message.author.id );
    const subcommand = ( args[0] + "" ).toLowerCase() + ( isAdmin + 0 );
    let response = "", responseType = "";
    switch( subcommand ) { 
      case "reload0":
        response = "My potions are too strong for you traveler :face_with_monocle:";
        break;
      case "reload1":
        response = "```fix\n";
        if( !!args[1] ) {
          // -- Potential OS injection here
          response += execSync( `babel src/commands/${args[1]}.js -o lib/commands/${args[1]}.js` ).toString() || args[1];
          loadCommands( bot, args[1] );
          console.info( `Re-loaded ${args[1]} command` );
        }
        else {
          response += execSync( "babel src/commands -d lib/commands" ).toString();
          loadCommands( bot, null );
          console.info( "Re-loaded all commands" );
        }
        response += "\n```\n:sweat_drops: **SIX** :sweat_drops: **HOT** :sweat_drops: **RELOADS** :sweat_drops:"
      break;
      case "die0":
        response = "Only the chosen may command such an atrocity";
        break;
      case "die1":
        console.info( "saving events..." );
        writeFileSync( "events.json", JSON.stringify( bot.var.events ), error => { console.error(error) });
        console.info( "saved events" );
        message.channel.send( "cya" );
        bot.destroy();
        exit( 0 );
      case "commands0":
      case "commands1":
        bot.commands.forEach( elem => response += `Name: **${elem.name}**\t${elem.description}\n` );
      break;
      case "regex0":
      case "regex1":
        const ops = !!args[1] && (args[1] == 0 || args[1] == "off") ? false : true;
        bot.var.messageOpsEnabled = ops;
        bot.user.setStatus( ops ? "online" : "idle" );
        response = ops ? "Real shit" : "I sleep";
        break;
      case "uptime0":
      case "uptime1":
        const totMinutes = Math.floor( bot.uptime / 60000 );
        const minutes = Math.floor( totMinutes % 60 );
        const totHours = Math.floor( totMinutes / 60 );
        response = `${totHours < 10 ? "0"+totHours : totHours}:${minutes < 10 ? "0"+minutes : minutes}`;
        break;
      case "vrms0":
      case "vrms1":
        response = execSync( "vrms" ).toString() || "exec vrms error";
        responseType = "code block";
      break;
      case "screenfetch0":
      case "screenfetch1":
        response = execSync( "screenfetch -N" ).toString() || "exec screenfetch error";
        response = response.replace( /`/g, "'" );
        response = "```\n" + response + "\n```";
      break;
      default:
        response = `no such subcommand: ${args[0]} :face_with_monocle:`;
    }
    if( response.length > 2000 ) sendBulk( response, message, responseType );
    else message.channel.send( response || "empty response; Complain to conor :triumph:" );
  }
}
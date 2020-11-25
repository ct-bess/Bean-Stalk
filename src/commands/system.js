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
    const isAdmin = bot.var.admins.includes( message.author.id );
    const subcommand = ( args[1] + "" ).toLowerCase() + ( isAdmin + 0 );
    let response = "", responseType = "";
    switch( subcommand ) { 
      case "reload0":
        response = "My potions are too strong for you traveler :face_with_monocle:";
        break;
      case "reload1":
        response = "```fix\n";
        if( !!args[1] ) {
          // -- Potential OS injection here
          response += execSync( `babel src/commands/${args[2]}.js -o lib/commands/${args[2]}.js` ).toString() || args[1];
          loadCommands( bot, args[2] );
          console.info( `Re-loaded ${args[2]} command` );
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
        const ops = !!args[2] && (args[2] == 0 || args[2] == "off") ? false : true;
        bot.var.messageOpsEnabled = ops;
        bot.user.setStatus( ops ? "online" : "idle" );
        response = ops ? "Real shit" : "I sleep";
        break;
      case "setnickname0":
      case "setnickname1":
        const nickname = message.content.substring( (args[0]+"").length + (args[1]+"").length + 2);
        bot.guilds.resolve( bot.var.guild ).members.resolve( bot.user.id ).setNickname( nickname );
        break;
      case "setstatus0":
      case "setstatus1":
        //const status = args[1] + "", type = !!args[2] ? args[2] + "" : "PLAYING";
        const typeCheck = (args[2]+"").startsWith( "-" );
        let status = "yep", type = "PLAYING";
        if( typeCheck ) {
          status = message.content.substring( (args[0]+"").length + (args[1]+"").length + (args[2]+"").length + 3 );
          type = (args[2]+"").substring(1);
        }
        else status = message.content.substring( (args[0]+"").length + (args[1]+"").length + 2 );
        bot.user.setActivity( status, { type: type } );
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
        response = `no such subcommand: ${args[1]} :face_with_monocle:`;
    }
    if( response.length > 2000 ) sendBulk( response, message, responseType );
    else if( response.length > 0 ) message.channel.send( response || "Complain to conor :triumph:" );
  }
}
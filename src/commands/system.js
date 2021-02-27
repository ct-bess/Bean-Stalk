import { execSync } from "child_process";
import { exit } from "process";
import { loadCommands } from "../loadCommands.js";
import { sendBulk } from "../sendBulk.js";
import { writeFileSync } from "fs"
import { argHandler } from "../argHandler.js"

export default {
  name: "system",
  description: "Bean Stalk system commands",
  aliases: [ "sys", "bean" ],
  exec( message, bot ) {
    const args = argHandler( message );
    const isAdmin = bot.var.admins.includes( message.author.id );
    const subcommand = ( args.get( 0 ) + "" ).toLowerCase();
    let response = "", responseType = "";
    switch( subcommand + (isAdmin + 0) ) { 
      case "reload0":
        response = "My potions are too strong for you traveler :face_with_monocle:";
        break;
      case "reload1":
        response = "```fix\n";
        if( args.has( 1 ) ) {
          // -- Potential OS injection here
          const fileName = args.get( 1 );
          response += execSync( `babel src/commands/${fileName}.js -o lib/commands/${fileName}.js` ).toString() || fileName + "";
          loadCommands( bot, fileName );
          console.info( `Re-loaded ${fileName} command` );
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
        //console.info( "saving events..." );
        //writeFileSync( "events.json", JSON.stringify( bot.var.events ), error => { console.error(error) });
        //console.info( "saved events" );
        message.reply( "***CHANGE THE WORLD... MY FINAL MESSAGE... GOOD BYE...***" );
        setTimeout( () => {
          bot.destroy();
          exit( 0 );
        }, 5000 );
        break;
      case "commands0":
      case "commands1":
        bot.commands.forEach( elem => response += `Name: **${elem.name}**\t${elem.description}\n` );
      break;
      case "regex0":
      case "regex1":
        const ops = args.has( "on" ) ? true : false;
        bot.var.messageOpsEnabled = ops;
        bot.user.setStatus( ops ? "online" : "idle" );
        response = ops ? "Real shit" : "I sleep";
        break;
      case "setnickname0":
      case "setnickname1":
        const nickname = args.get( "name" ) || args.get( "nickname" ) || args.get( 1 ) || "Bean-Stalk"
        console.debug( "setting nickname to:", nickname );
        bot.guilds.resolve( bot.var.guild ).members.resolve( bot.user.id ).setNickname( nickname );
        break;
      case "setstatus0":
      case "setstatus1":
        const status = args.get( "status" ) || args.get( 1 ) || "nothing"
        const type = args.has( "type" ) ? (args.get( "type" ) + "").toUpperCase() : "PLAYING";
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
        response = `no such subcommand: ${subcommand} :face_with_monocle:`;
    }
    if( response.length > 2000 ) sendBulk( response, message, responseType );
    else if( response.length > 0 ) message.channel.send( response || "Complain to conor :triumph:" );
  }
}
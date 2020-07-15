import { execSync } from "child_process";
import { exit } from "process";
import { loadCommands } from "../loadCommands.js";

export default {
  name: "system",
  description: "Bean Stalk system commands\n`commands`: list all bot commands\n`reload`: transpile and reload commands\n`die`: logs out Bean Stalk",
  aliases: [ "sys", "bean" ],
  exec( message, args, bot ) {
    switch( args[0] ) { 
      case "reload":
        const status = execSync( "babel src/commands -d lib/commands" ).toString();
        message.channel.send( "```fix\n" + status + "\n```" );
        loadCommands( bot, true );
        console.info( "Loaded Commands:", bot.commands );
        message.channel.send( ":sweat_drops: SIX :sweat_drops: HOT :sweat_drops: RELOADS :sweat_drops:" );
      break;
      case "die":
        message.reply( ":sob:" );
        bot.destroy();
        exit( 0 );
      break;
      case "commands":
        message.reply( "Aight bruh" );
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
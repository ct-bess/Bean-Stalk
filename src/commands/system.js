import { execSync } from "child_process";
import { loadCommands } from "../loadCommands.js";

export default {
  name: "system",
  description: "Bean Stalk system commands\n`reload` recompiles and reloads commands\n`die` logs out Bean Stalk",
  aliases: [],
  exec( message, args, bot ) {
    switch( args[0] ) { 
      case "reload":
        const status = execSync( "babel src/commands -d lib/commands" ).toString();
        message.channel.send( `\`${status}\`` );
        loadCommands( bot, true );
        console.info( "Loaded Commands:", bot.commands );
        message.channel.send( ":sweat_drops: SIX :sweat_drops: HOT :sweat_drops: RELOADS :sweat_drops:" );
      break;
      case "die":
        message.reply( ":sob:" );
        bot.destroy();
      break;
      default:
        console.warn( `system command ${args[0]} not found` );
    }
  }
}
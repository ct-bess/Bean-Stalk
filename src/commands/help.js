import { argHandler } from "../commandUtil.js";
import help from "../../help.json";

export default {
  name: "help",
  aliases: [],
  description: "get help on the specified command and/or subcommand",
  exec( message, bot ) {
    const args = argHandler( message );

    const commandArg = args.get( 0 );
    const subcommandArg = args.get( 1 );
    const command = bot.commands.get( commandArg ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArg ) );

    if( !!command ) {

      let helpEmbed = {};

      // this is an unordered array of objects, you'll have to run a .find( elem => elem.name === subcommandArg )
      if( !!help[command.name[subcommandArg]] ) {
        helpEmbed = help[command.name[subcommandArg]] || {};
      }
      else helpEmbed = help[command.name] || {};

      helpEmbed.color = 0xffea00;
      helpEmbed.title = command.name + "";
      helpEmbed.description = command.description + "";
      helpEmbed.footer = { text: "aliases: " + command.aliases.join(', ') };

      message.channel.send({ embed: helpEmbed });

    }
    else {
      message.channel.send( `no such command: ${commandArg}` );
    }

  } // EO exec
};

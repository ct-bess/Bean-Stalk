import { argHandler } from "../commandUtil.js";
import help from "../../help.json";

export default {
  name: "help",
  aliases: [],
  description: "get help on the specified command and/or subcommand",
  exec( message, bot ) {
    const args = argHandler( message );

    if( !args.has( 0 ) ) {
      const cmdFormatEmbed = {
        color: 0xffea00,
        title: "Command help:",
        description: "",
        fields: [
          {
            name: "Command Format:",
            value: "`Command flags/variables subcommand expression`\n`Command subcommand flags/variables expression`"
          },
          {
            name: "subcommands:",
            value: "Some commands have and require you to specify a subcommand. They are commands of commands"
          },
          {
            name: "flags and variables:",
            value: "Some commands allow you to change default functionality with flags and variables. flags are denoted by `-`, variables are denoted with `--` and then `=` (encase your variable in quotes if it has spaces). Keep in mind, using these flags/variables are always optional"
          },
          {
            name: "expressions:",
            value: "A command's expression is always the last part; It is usually something a bit more involved than the rest that the command processes. Expressions are sometimes required and sometimes are used as a shorthand for a flag/variable (usually when a subcommand has 1 required option)"
          }
        ]
      };

      message.channel.send({ embed: cmdFormatEmbed });
      return;
    }

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

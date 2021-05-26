import { argHandler } from "../commandUtil.js";
import help from "../../help.json";

export default {
  name: "help",
  aliases: [ "h" ], 
  description: "get help on the specified command and/or subcommand",
  exec( message, bot ) {
    const args = argHandler( message );

    if( !args.has( 0 ) ) {
      const cmdFormatEmbed = {
        color: 0xffea00,
        title: "__Command help:__",
        description: "*Ya'll wana learn how to do a command???*",
        fields: [
          {
            name: "__Command Format/Usage:__",
            value: "`Command -flags --variables=something subcommand expression`\n`Command subcommand -flags --variables=\"some value\" expression`"
          },
          {
            name: "__Subcommands:__",
            value: "Some commands have and require you to specify a subcommand. They are commands of commands\nA subcommand is *usually* the 2nd *word* of a full command, however not all commands follow this convention"
          },
          {
            name: "__Flags:__",
            value: "Prefixed by 1 hyphen: `-`\nFlags are simply boolean variables that change command behavior\n__Examples:__ `-flag`\n`-EnableMemes`\n`-DisableMemes`"
          },
          {
            name: "__Variables:__",
            value: "Prefixed by 2 hyphens: `--` and their value can be enclosed by quotes to preserve spaces\nVariables give you a verbose way of changing a command's behavior, they are often optional\n__Examples:__ `--variable=12345`\n`--variable=\"encased in quotes, spaces are preserved!\"`"
          },
          {
            name: "__Expressions:__",
            value: "A command's expression is always the remaining text; It is usually something a bit more involved than the rest that the command processes. Expressions are sometimes required and sometimes are used as a shorthand for a flag/variable (usually when a subcommand has 1 required option)"
          },
          {
            name: "__Command/Subcommand Aliases:__",
            value: "Lots of commands have shorthand aliases, or additional names we can call them by. An alias can be substituted as the command's name to trigger the command. Some subcommands also have aliases too\n__Example:__ `js` is a command name alias for `javascript`"
          },
          {
            name: "What's next?",
            value: "Run `[bean commands` for a list of commands and `[help CommandName` on the command you want to run."
          }
        ],
        footer: { 
          text: "A certified Bean-Stalk #moment (command name aliases will be shown down here)",
          icon_url: bot.user.displayAvatarURL()
        }
      };

      message.channel.send({ embed: cmdFormatEmbed });
      return;
    }

    const commandArg = args.get( 0 );
    const subcommandArg = args.get( 1 );
    const command = bot.commands.get( commandArg ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArg ) );

    if( !!command ) {

      let helpEmbed = {};

      if( !!help[command.name[subcommandArg]] ) {
        helpEmbed = help[command.name[subcommandArg]] || {};
      }
      else helpEmbed = help[command.name] || {};

      helpEmbed.color = 0xffea00;
      helpEmbed.title = command.name;
      helpEmbed.description = command.description + "\n__**Options:**__";
      helpEmbed.footer = {
        text: "aliases: " + command.aliases.join(', '),
        icon_url: bot.user.displayAvatarURL()
      };

      message.channel.send({ embed: helpEmbed });

    }
    else {
      message.channel.send( `no such command: ${commandArg}` );
    }

  } // EO exec
};

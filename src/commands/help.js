import Command from "../struct/Command";

/**
 * In depth help command that provides more clarity on general command usage,
 * and displays help text for each subcommand if called with a command name argument
 * @extends Command
 * @todo
 * display role/admin restrictions on commands/subcommand help text
 */
class Help extends Command {

  constructor(
    CommandOptions = {
      name: "help",
      description: "Get help on the specified command or general help",
      aliases: [ "h" ]
    }
  ) {
    super( CommandOptions );
  }

  /**
   * respond with help text for command or general help
   * @method exec
   * @override
   * @this Command
   * @memberof Help
   * @param {Message} message
   * @param {Bot} bot
   * @returns {void}
   */
  exec = ( message, bot ) => {

    const args = this.getArgs( message );
    const commandName = args.get( 0 );
    const embedData = {};

    if( !commandName ) {
      const prefix = bot.var.config.prefix;
      embedData.title = "__Command help:__";
      embedData.description = "*Ya'll wana learn how to do a command???*";
      embedData.fields = [
        {
          name: "__Bot Prefix:__",
          value: `I'll ignore *nearly* :tm: every message that doesn't start with: \`${prefix}\``
        },
        {
          name: "__Command Format/Usage:__",
          value: `\`${prefix}Command -flags --variables=something subcommand expression\`\n\`${prefix}Command subcommand -flags --variables="some value" expression\``
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
          value: `Run \`${prefix}bean commands\` for a list of commands and \`${prefix}help CommandName\` on the command you want to run.`
        }
      ];
    }
    else {

      /** @type {Command} */
      const command = bot.commands.get( commandName ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandName ) );
      if( !command ) {
        console.debug( "Command or alias doesn't exist; Cannot provide help" );
        message.reply( "ain't got no such command or alias" );
        return;
      }
      embedData.title = `__${command.name}:__`;
      embedData.description = command.description;
      embedData.fields = [];
      for( const key in command.modules ) {

        // default help module, etc
        if( !command.modules[key]?.name ) continue;

        embedData.fields.push({
          name: `__${command.modules[key]?.name}__`,
          value: command.modules[key]?.help
        })

      }

      if( command.aliases.length > 0 ) {
        embedData.fields.push({
          name: "> aliases:",
          value: command.aliases.join( ", " )
        });
      }

    }

    const embed = bot.createEmbed( embedData );
    message.send( embed );

  }

};

export default new Help();

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('../struct/Bot').default} Bot
 */

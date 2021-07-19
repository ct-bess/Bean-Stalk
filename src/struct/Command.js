import { 
  argHandler, 
  sendBulk as _sendBulk,
  coalesce as _coalesce
 } from "../util/commandUtil";

/**
 * Base Command class for commands to inherit.
 * Subcommands *should* be defined as methods of inherited classes.
 * @property {string} name - The command's name
 * @property {string} description - A short description of the command
 * @property {Array<string>} aliases - alternative names for the command
 * @property {(Subcommand|object)} modules - list of the subcommands/modules with help text of command
 * @property {function} - any method aside from the defaults are subcommands set by constructor
 */
class Command {

  /**
   * all spaces in name and aliases are replaced with underscore, they're also lower cased.
   * The standard for subcommands/modules is that they're lower cased too.
   * @param {string} [name=""] - The command's name that triggers it
   * @param {string} [description=""] - The command's description
   * @param {Array<string>} [aliases=[]] - alternative or shorthand command names that also trigger it
   * @param {(Subcommand|object)} [modules] - all subcommands or modules that users can execute from command
   */
  constructor( name = "", description = "", aliases = [], modules ) {

    if( name.length === 0 ) {
      throw "Command name cannot be empty"
    }

    this.name = name.replaceAll( " ", "_" ).toLowerCase();
    this.description = description;
    this.aliases = [];
    this.modules = {
      help: {
        onlyAdmins: false,
        help: "I'm doing a brother check-in. Showing support for one another.\nI need SIX men to post, not share, this message to show you are always there if someone needs to talk.\nLet's go gentlemen...."
      }
    };

    for( const alias of aliases ) {
      this.aliases.push( (alias + "").replaceAll( " ", "_" ).toLowerCase() );
    }

    if( modules ) {
      for( const key in modules ) {
        const moduleName = modules[key].name;
        this[moduleName] = modules[key].exec;
        this[moduleName] = this[key].bind( this );
        delete modules[key].exec;
        this.modules[moduleName] = modules[key];
      }
    }

    console.trace( "Created Command:", this );

  }

  /**
   * Function that executes on command.
   * Default behavior simply tries to execute a subcommand;
   * Override this for more complex cases and cases where you don't have any subcommands
   * @method exec
   * @memberof Command
   * @param {Message} message - The Discord Message that triggered the command
   * @param {Bot} bot - the Discord Client executing the command
   * @returns {void}
   */
  exec = ( message, bot ) => {

    const args = this.getArgs( message ); 
    const subcommand = (args.get( 0 ) + "").toLowerCase();
    const isAdmin = bot.var.admins.includes( message.author.id );

    if( this.modules[subcommand] ) {

      let response = "";
      const onlyAdmins = !!this.modules[subcommand]?.onlyAdmins;

      if( !onlyAdmins || ( onlyAdmins && isAdmin ) ) {
        response = this[subcommand]?.call( this, args, message, bot );
      }
      else {
        response = ":flushed: You ain't no Bean admin :flushed:";
        console.info( "non admin command execution attempt by:", message.author.id );
      }

      if( !!response && ( response?.length > 0 || typeof( response ) === "object" ) ) {
        message.send( response );
      }

    }
    else {
      console.info( "Nothing was executed for command:", this.name );
    }

  }

  /**
   * Default help subcommand.
   * - Called alone `command help`: returns command's description
   * - Called with an expression `command help subcommand`: returns subcommand's description if any
   * @method help
   * @memberof Command
   * @param {commandArg} args
   * @returns {string} help text for subcommand/module or command's description
   */
  help = ( args ) => {

    const subcommand = (args.get( 1 ) + "").toLowerCase();
    const response = this.modules[subcommand]?.help || this.description;
    return( response );

  }

  /**
   * React with success emoji to message; Default is unicode zero, :0:
   * @method successReact
   * @memberof Command
   * @param {Message} message
   * @param {EmojiResolvable} [emoji="\u0030\u20E3"]
   * @returns {void}
   */
  successReact = ( message, emoji ) => {
    message.react( emoji || "\u0030\u20E3" );
  }

  /**
   * React with failure to message; Default is unicode one, :1:
   * @method successReact
   * @memberof Command
   * @param {Message} message
   * @param {EmojiResolvable} [emoji="\u0031\u20E3"]
   * @returns {void}
   */
  failureReact = ( message, emoji ) => {
    message.react( emoji || "\u0031\u20E3" );
  }

  /**
   * wrapper to {@link commandUtil.argHandler}
   * @method getArgs
   * @memberof Command
   * @param {(Message|string)} message - Discord.Message or its' contents to get args from
   * @returns {Collection<commandArg,argVal>} arg map
   * @todo 
   * consider adding different ways to get args, ie. "complex" might be calling argHandler, "simple" could be only taking an expr and/or subcommand
   */
  getArgs = ( message ) => {
    const args = argHandler( message );
    return( args );
  }

  /**
   * wrapper to {@link commandUtil.sendBulk}
   * @method sendBulk
   * @memberof Command
   * @param {string} response the long string we want to send in bulk
   * @param {Message} message the message origin
   * @param {string} [format] optional, the markdown format to use: italics, bold, inline code, quote, quote block, code block
   * @param {string} [codeBlockType=""] optional, the language to format the code with
   * @returns {void}
   */
  sendBulk = ( response, message, format, codeBlockType ) => {
    _sendBulk( response, message, format, codeBlockType )
  }

  /**
   * wrapper to {@link commandUtil.coalesce}
   * @method coalesce
   * @memberof Command
   * @param {string} name - the user, channel, or role name or snowflake ID we are coalescing
   * @param {("channel"|"member"|"role")} type - what discord class type we are converting it
   * @param {Bot} [bot] - discord client processing this (not needed for member and role coalescing)
   * @param {Guild} [guild] - guild origin (not needed for channel coalescing)
   * @returns {?(Channel|Member|Role)} the Discord object with respect to the input type; If null the coalescing failed
   */
  coalesce = ( name, type, bot, guild ) => {
    const base = _coalesce( name, type, bot, guild );
    return( base );
  }

};

export default Command;

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Collection} Collection
 * @typedef {import('./Bot').default} Bot
 * @typedef {import('../util/commandUtil').commandArgs} commandArgs
 */
